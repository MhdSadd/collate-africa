import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from '../dospaces/dospaces.config';

@Injectable()
export class CheckBucketExist {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async check(bucketName: string) {
    try {
      const data = await this.s3.headBucket({ Bucket: bucketName }).promise();

      return true;
    } catch (err) {
      if (err.statusCode === 403) {
        return false;
        // throw new UnauthorizedException(`Bucket "${bucketName}" Access Denied`);
      }

      if (err.statusCode >= 400 && err.statusCode < 500) {
        return false;
        // throw new NotFoundException(`Bucket "${bucketName}" Not Found`);
      }

      throw err;
    }
  }
}
