import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';

@Injectable()
export class AwsConfigService {
  private readonly ses: SES;

  constructor() {
    this.ses = new SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  public getSES(): SES {
    return this.ses;
  }
}
