import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getUser } from '../common/decorators/get-user-decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async registerUser(
    @Body() userDto: UserDto,
    @Req() res,
  ): Promise<Record<string, unknown>> {
    return this.userService.registerUser(userDto, res);
  }

  @Get('find-one')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneByEmail(@getUser('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @getUser('email') email: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.updateUser(email, userUpdateDto);
  }
}
