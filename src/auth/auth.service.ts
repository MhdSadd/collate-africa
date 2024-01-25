import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { JwtHelper } from '../utils/jwt-token.helper';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtHelper: JwtHelper,
    private readonly userService: UserService,
  ) {}

  async verifyAccount(secretToken: string) {
    this.logger.log(
      `starting the verification process: checking user with matching token...`,
    );

    const userWithToken = await this.userRepository
      .createQueryBuilder('user')
      .where('user.secretToken = :secretToken', { secretToken })
      .getOne();

    if (!userWithToken)
      throw new BadRequestException('Invalid verification token detected');

    this.logger.log(`user with token found: setting user as verified...`);

    userWithToken.isVerified = true;
    userWithToken.secretToken = null;

    this.logger.log(
      `user with mail: [${userWithToken.email}] verified successfully`,
    );

    await this.userRepository.save(userWithToken);

    return {
      success: true,
      message: 'Account verified',
      user: userWithToken,
      token: await this.jwtHelper.generateToken({ email: userWithToken.email }),
    };
  }
  async validateUser(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user || user === null || user === undefined) {
      throw new UnauthorizedException('Email not valid');
    }

    return user;
  }
}
