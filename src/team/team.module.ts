import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities';
import { OTPHelper } from 'src/utils/otp-generate';
import { JwtHelper } from 'src/utils/jwt-token.helper';
import { User } from '../user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User])],
  providers: [TeamService, OTPHelper, JwtHelper],
  controllers: [TeamController],
})
export class TeamModule {}
