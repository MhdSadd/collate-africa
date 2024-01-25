import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/common/decorators/get-user-decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateTeamDto } from './dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('create')
  async createNewTeam(@Body() creatTeamDto: CreateTeamDto) {
    return this.teamService.createNewTeam(creatTeamDto);
  }

  @Get('find-one')
  async findOneTeamById(@Query('code') code: string) {
    return this.teamService.findOneTeamById(code);
  }

  @Get('user-teams')
  @UseGuards(JwtAuthGuard)
  async findAllUserTeams(@getUser('email') email: string) {
    return this.teamService.findAllUserTeams(email);
  }
}
