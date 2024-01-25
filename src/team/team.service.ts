import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities';
import { OTPHelper } from 'src/utils/otp-generate';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto';
import { Team } from './entities';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly oTPHelper: OTPHelper,
  ) {}

  async createNewTeam(creatTeamDto: CreateTeamDto) {
    const { teamName } = creatTeamDto;
    const teamCode = await this.oTPHelper.generateRandomeCode();

    this.logger.log(`creating new team with name [${teamName}]`);
    const newTeam = this.teamRepo.create();
    newTeam.teamName = creatTeamDto.teamName;
    newTeam.description = creatTeamDto.description;
    newTeam.code = teamCode.toString();
    newTeam.ownerEmail = creatTeamDto.ownerEmail;
    newTeam.ownerPhone = creatTeamDto.ownerPhone;
    newTeam.successMessage = creatTeamDto.successMessage;

    try {
      this.logger.log(`saving newly created team with name [${teamName}]...`);
      await this.teamRepo.save(newTeam);
    } catch (error) {
      this.logger.error(`error creating new team ${error.message || error}`);
      throw new ServiceUnavailableException(
        `error creating new team ${error.message || error}`,
      );
    }

    return {
      success: true,
      teamLink: `https://www.collate.africa/register?code=${teamCode}`,
    };
  }

  async findOneTeamById(teamId: string): Promise<object> {
    this.logger.log(`getting the team name for ${teamId}...`);
    const team = await this.teamRepo.findOne({ where: { code: teamId } });

    if (!team || team === null || team === undefined)
      throw new NotFoundException(`team with team ${teamId} deosn't exist`);

    return { teamName: team.teamName };
  }

  async findAllUserTeams(email: string) {
    const loggedInUser = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!loggedInUser || loggedInUser === null || loggedInUser === undefined)
      throw new NotFoundException(`user with email ${email} doesn't exist`);

    if (loggedInUser.teams === null || loggedInUser.teams === undefined)
      return [];

    const teams = loggedInUser.teams;
    const teamsArray = [];
    for (let i = 0; i < teams.length; i++) {
      teamsArray.push(await this.findOneTeam(teams[i]));
    }
    return teamsArray;
  }

  async findOneTeam(teamId: string): Promise<object> {
    this.logger.log(`getting the team name for ${teamId}...`);
    const team = await this.teamRepo.findOne({ where: { code: teamId } });

    if (!team || team === null || team === undefined)
      throw new NotFoundException(`team with team ${teamId} deosn't exist`);

    return { id: team.code, teamName: team.teamName };
  }
}
