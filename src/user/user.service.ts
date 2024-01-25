import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/create-user.entity';
import { AccountVerificationMail } from '../templates/mails/account-verification-mail';
import { JwtHelper } from '../utils/jwt-token.helper';
import { UserDto, UserUpdateDto } from './dto';
import { AwsService } from '../aws/aws.service';
import { mixpanel } from 'src/config/mixpanel.config';
import { Team } from 'src/team/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtHelper: JwtHelper,
    private readonly awsService: AwsService,
  ) {}

  async registerUser(
    userDto: UserDto,
    res: any,
  ): Promise<Record<string, unknown>> {
    const { email, teamCode } = userDto;

    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (userExists) {
      throw new BadRequestException('A user with this mail already exists');
    }

    const secretToken = await this.jwtHelper.generateVerificationToken({
      email,
    });
    const loginToken = await this.jwtHelper.generateToken({ email });

    try {
      const user = this.userRepository.create();

      user.email = userDto.email, user.state = userDto.state;
      user.stateId = userDto.stateId;
      user.LGA = userDto.LGA;
      user.LGAId = userDto.LGAId;
      user.ward = userDto.ward;
      user.wardId = userDto.wardId;
      user.pollingUnit = userDto.pollingUnit;
      user.pollingUnitId = userDto.pollingUnitId;
      user.secretToken =  secretToken
      user.teams = userDto.teamCode ? [userDto.teamCode] : null;

      console.log('formatted user registration payload: ' + user);

      const verificationMail = new AccountVerificationMail(
        email,
        secretToken,
        this.awsService,
      );
      await verificationMail.authEmail();

      await this.userRepository.save(user);
      delete user.secretToken;

      mixpanel.track('User Registration', {
        distinct_id: email,
        email: email,
        state: userDto.state,
        lga: userDto.LGA,
      });

      return {
        message: 'User created successfully',
        user,
        token: loginToken,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A user with this email already exists');
      } else {
        console.log(`Error creating user  Error: ${error}`);
        throw new InternalServerErrorException(
          'An error occurred during registeration, try again later',
        );
      }
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined | object> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException('no user found with email address');
    }

    return {
      id: user.id,
      email: user.email,
      state: { name: user.state, id: user.stateId },
      LGA: { name: user.LGA, id: user.LGAId },
      ward: { name: user.ward, id: user.wardId },
      pollingUnit: { name: user.pollingUnit, id: user.pollingUnitId },
      isVerified: user.isVerified,
      secretToken: user.secretToken,
    };
  }

  async findOneById(id: string): Promise<User> {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('This user does not exist');
    return user;
  }

  async updateUser(email: string, userUpdateDto: UserUpdateDto) {
    const userWithEmail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!userWithEmail)
      throw new NotFoundException(`user record not found: update error`);

    Object.assign(userWithEmail, userUpdateDto);
    if (userUpdateDto.teamCode) {
      userWithEmail.teams.push(userUpdateDto.teamCode);
    }
    await this.userRepository.save(userWithEmail);

    return {
      success: true,
      message: 'user updated successfully',
      user: await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne(),
    };
  }

  // async hashPassword(password: string) {
  //   const passwordhashed = await argon2.hash(password);
  //   return passwordhashed;
  // }
}
