import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AwsService } from '../aws/aws.service';
import { AuthService } from '../auth/auth.service';
import { LoginLinkMail } from '../templates/mails/login-link-mail';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private awsService: AwsService,
  ) {
    super({
      secret: process.env.MAGIC_LINK_SECRET,
      jwtOptions: {
        expiresIn: '6h',
      },
      callbackUrl: `${process.env.MAGIC_LINK_HOSTNAME}/api/v1/auth/login/callback`,
      sendMagicLink: async (destination, href) => {
        await new LoginLinkMail(destination, href, awsService).sendEmail();
      },
      verify: async (payload, callback) => {
        callback(null, this.validate(payload));
      },
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);
    return user;
  }
}
