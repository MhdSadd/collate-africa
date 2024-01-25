import { Injectable } from '@nestjs/common';
import { generate } from 'randomstring';
import { JwtHelper } from './jwt-token.helper';

@Injectable()
export class OTPHelper {
  async generateRandomeCode(): Promise<number> {
    // const base = generate({
    //   length: 2,
    //   charset: 'alphabetic',
    // });
    const code = generate({
      length: 8,
      charset: 'numeric',
    });

    return code;
  }
}
