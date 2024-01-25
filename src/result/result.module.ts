import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities';
import { Result, Parties, PartyResult } from './entities';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Parties, PartyResult, User]), ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
