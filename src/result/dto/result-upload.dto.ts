import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Election } from '../enum/election.enum';

export class ResultUploadDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "polling unit's total valid votes",
  })
  total_valid_votes: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "polling unit's total rejected votes",
  })
  total_rejected_votes: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "polling unit's total accredited voters",
  })
  total_accredited_voters: string;

  @IsNotEmpty()
  @IsEnum(Election, {
    message:
      'Valid election options are "president", "senate", "fed_house_of_reps", "state_house_of_reps", and "governor"',
  })
  @ApiProperty({
    description:
      'election for which result is being uploaded: one of ["president", "senate", "fed_house_of_reps", "state_house_of_reps", "governor"]',
  })
  election: Election;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'user election [state]; as gotten from user profile or as edited',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'user election [LGA]; as gotten from user profile or as edited',
  })
  LGA: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'user election [ward]; as gotten from user profile or as edited',
  })
  ward: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'user election [polling unit]; as gotten from user profile or as edited',
  })
  pollingUnit: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'an array of objects of parties votes in format [{partyId: partyVote}, ...]',
  })
  partiesVotes: any[];

  @ApiProperty({ type: 'string', format: 'binary' })
  result: Express.Multer.File;

  @IsOptional()
  @IsString()
  ip: string;
}
