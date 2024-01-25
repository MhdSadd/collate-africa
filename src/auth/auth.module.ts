import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../utils/jwt.strategy';
import { AuthService } from './auth.service';
import { User } from '../user/entities';
import { JwtHelper } from '../utils/jwt-token.helper';
import { UserModule } from '../user/user.module';
import { MagicLoginStrategy } from '../utils/magic-login.strategy';
import { AwsService } from '..//aws/aws.service';
import { AwsConfigService } from '../config/aws.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRY,
      },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtHelper,
    MagicLoginStrategy,
    AwsService,
    AwsConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
