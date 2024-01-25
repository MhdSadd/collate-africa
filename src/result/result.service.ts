import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DospacesService } from '../dospaces/dospaces.service';
import { ResultUploadDto } from './dto/result-upload.dto';
import { Parties, PartyResult, Result } from './entities';
import { User } from 'src/user/entities';
import { mixpanel } from 'src/config/mixpanel.config';
import dataSource from '../typeorm/typeorm.config';

@Injectable()
export class ResultService {
  private readonly logger = new Logger(ResultService.name);
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Parties)
    private readonly partyRepository: Repository<Parties>,
    @InjectRepository(PartyResult)
    private readonly partyResultRepository: Repository<PartyResult>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly doSpacesService: DospacesService,
  ) {}

  async getAllParties(): Promise<Parties[]> {
    return this.partyRepository.find();
  }

  async getPartyNameById(partyId: string): Promise<string> {
    this.logger.log(`getting party acronym for party with ID: [${partyId}]`);
    const partyName = await this.partyRepository.findOne({
      where: { partyId },
    });
    if (!partyName) {
      this.logger.warn(`no party has an ID: [${partyId}]`);
      throw new NotFoundException(`Party with [${partyId}] not found`);
    }
    return partyName.partyAcronym;
  }

  async createResult(
    resultUploadDto: ResultUploadDto,
    email: string,
  ): Promise<Result> {
    this.logger.log(
      `creating new result with PAYLOAD: ${{ ...resultUploadDto }}`,
    );
    this.logger.log(
      `TYPEOF_PARTYVOTES IS: ${typeof resultUploadDto.partiesVotes}`,
    );

    this.logger.log(
      `looking for userId to associate with the new result via logged in token email: [${email}]`,
    );

    const userWithMail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!userWithMail || userWithMail === undefined || userWithMail === null) {
      this.logger.log(
        `user lookup return no user with email:[${email}], Possible account deleted error`,
      );
      throw new NotFoundException(
        `user lookup return no user with email:[${email}], Possible account deleted error`,
      );
    }

    const userData = await this.getSingleResultByFilter(
      userWithMail.id,
      resultUploadDto.election,
      resultUploadDto.pollingUnit,
    );

    if (userData) {
      await this.deleteResult(userData.id);
    }

    this.logger.log(`Parsing the stringyfied PARTYVOTES array to array...`);

    const partiesVotesToArray = JSON.parse(
      resultUploadDto.partiesVotes.toString().replace(/'/g, '"'),
    );

    this.logger.log(`The parsed array is: ${partiesVotesToArray}`);

    const newResult = this.resultRepository.create();
    newResult.election = resultUploadDto.election;
    newResult.state = resultUploadDto.state;
    newResult.LGA = resultUploadDto.LGA;
    newResult.ward = resultUploadDto.ward;
    newResult.pollingUnit = resultUploadDto.pollingUnit;
    newResult.total_accredited_voters = resultUploadDto.total_accredited_voters;
    newResult.total_valid_votes = resultUploadDto.total_valid_votes;
    newResult.total_rejected_votes = resultUploadDto.total_rejected_votes;
    newResult.userId = userWithMail.id;
    newResult.ip =
      resultUploadDto.ip !== null ||
      resultUploadDto.ip === '' ||
      resultUploadDto.ip !== undefined
        ? resultUploadDto.ip
        : null;

    mixpanel.track('Election Vote Stats', {
      state: resultUploadDto.state,
      lga: resultUploadDto.LGA,
      ward: resultUploadDto.ward,
      pollingUnit: resultUploadDto.pollingUnit,
      totalAccreditedVoters: resultUploadDto.total_accredited_voters,
      totalValidVotes: resultUploadDto.total_valid_votes,
      totalRejectedVotes: resultUploadDto.total_rejected_votes,
      user: userWithMail.email,
    });

    const resultUploadURL = await this.doSpacesService.uploadFile(
      resultUploadDto.result,
      resultUploadDto,
    );
    newResult.resultURL = resultUploadURL;

    const newPartyResults = [];
    for (const partyVote of partiesVotesToArray) {
      const partyId = Object.keys(partyVote)[0];
      const vote = partyVote[partyId];
      const newPartyResult = new PartyResult();
      newPartyResult.partyAcronym = await this.getPartyNameById(partyId);
      newPartyResult.partyId = partyId;
      newPartyResult.vote = vote;
      newPartyResults.push(newPartyResult);

      mixpanel.track('Electiton Party Vote', {
        partyId: partyId,
        vote: vote,
        partyName: newPartyResult.partyAcronym,
        user: userWithMail.email,
        lga: userWithMail.LGA,
        state: userWithMail.state,
        ward: userWithMail.ward,
        pollingUnit: userWithMail.pollingUnit,
      });
    }

    // Associate the new PartyResult entities with the new Result entity
    newResult.partyResultsId = newPartyResults;

    try {
      await this.resultRepository.save(newResult);
      this.logger.log(`New result saved successfully`);
    } catch (error) {
      this.logger.error(
        `An error occured creating new result ${error.message || error}`,
      );
      throw new ServiceUnavailableException(
        `An error occured creating new result ${error.message || error}`,
      );
    }

    mixpanel.track('Result Saved', {
      result: newResult,
    });

    return newResult;
  }

  async getResultByUser(email: string) {
    const userWithMail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    const id = userWithMail?.id;

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let userResults;
    try {
      userResults = await this.resultRepository
        .createQueryBuilder('result', queryRunner)
        .where('userId = :id', { id })
        .select([
          'result.id',
          'result.election',
          'result.state',
          'result.LGA',
          'result.pollingUnit',
          'result.createdAt',
          'result.resultURL',
        ])
        .getMany();

      this.logger.log(`commiting transaction to DB...`);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`transaction error detected: rolling back changes...`);
      await queryRunner.rollbackTransaction();
    } finally {
      this.logger.log(
        `transaction done, releasing query runner connection back to pool...`,
      );
      await queryRunner.release();
    }

    if (!userResults || userResults.length === 0) return [];

    for (let i = 0; i < userResults.length; i++) {
      userResults[i].election = userResults[i].election
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return userResults;
  }

  async getSingleResult(id: string): Promise<Result> {
    const singleResult = await this.resultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.partyResultsId', 'partyResultsId')
      .where('result.id = :id', { id: id })
      .getOne();

    if (!singleResult || singleResult === null || singleResult === undefined)
      throw new NotFoundException(`no result found with this ${id}`);
    return singleResult;
  }

  async deleteResult(resultId: string) {
    let resultToDelete: Result | Result[];
    try {
      resultToDelete = await this.resultRepository.findOneOrFail({
        where: { id: resultId },
      });
    } catch (error) {
      throw new NotFoundException(
        `delete error: error deleting result with Id: [${resultId}]`,
      );
    }

    await this.resultRepository.remove(resultToDelete);

    return { success: true, message: `data deleted successfully` };
  }

  async getSingleResultByFilter(userId: string, election: string, pu: string) {
    const findUserData = await this.resultRepository
      .createQueryBuilder('result')
      .where('result.userId = :id', { id: userId })
      .andWhere('result.election = :election', { election })
      .andWhere('result.pollingUnit = :pollingunit', { pollingunit: pu })
      .getOne();

    return findUserData;
  }
}
