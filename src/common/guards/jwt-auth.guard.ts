import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../user/entities/create-user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(err: unknown, user: User): any {
    if (!user)
      throw new UnauthorizedException(
        'You need to login to access this resource.',
      );
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user }: Request = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}
