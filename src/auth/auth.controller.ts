import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { getUser } from '../common/decorators/get-user-decorator';
import { MagicLinkAuthGuard } from '../common/guards/magic-link-auth.guard';
import { JwtHelper } from '../utils/jwt-token.helper';
import { MagicLoginStrategy } from '../utils/magic-login.strategy';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { UserService } from '../user/user.service';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly magicLinkStrategy: MagicLoginStrategy,
    private readonly jwtHelper: JwtHelper,
  ) {}

  @Get('verify-account')
  async verifyAccount(@Query('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @Post('login')
  async login(@Req() req, @Res() res, @Body() body: LoginDto) {
    if (!body.destination)
      throw new BadRequestException('Please enter a valid email address');
    await this.userService.findOneByEmail(body.destination);
    this.authService.validateUser(body.destination);

    return this.magicLinkStrategy.send(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(MagicLinkAuthGuard)
  @Get('login/callback')
  async loginCallback(@getUser('email') email: string, @Res() res: Response) {
    const token = await this.jwtHelper.generateToken({ email });
      console.log(token)
    return res.redirect(
      `https://www.collate.africa/verify?token=${token}&mode=l`,
    );
  }
}
