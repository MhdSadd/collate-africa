import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/create-user.entity';
import { JwtHelper } from '../utils/jwt-token.helper';
import { AwsModule } from '../aws/aws.module';
import { Team } from 'src/team/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team]), AwsModule],
  providers: [UserService, JwtHelper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
