import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'user valid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user voting state' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user voting stateId' })
  stateId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting LGA' })
  LGA: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting LGAId' })
  LGAId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting ward' })
  ward: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting wardId' })
  wardId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting polling unit' })
  pollingUnit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user voting polling unitId' })
  pollingUnitId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'user voting polling unitId' })
  teamCode: string;
}
