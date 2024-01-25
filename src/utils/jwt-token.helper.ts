import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelper {
  async generateToken(payload: object): Promise<string> {
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    return jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  async generateVerificationToken(payload: object): Promise<string> {
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    return jwtService.sign(payload, {
      expiresIn: process.env.JWT_VERIFICATION_EXPIRY,
    });
  }

  async verifyToken(token: string) {
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    try {
      jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(
        `This OTP is inavlid or expired, request for another one ${error}`,
      );
    }
  }
}
