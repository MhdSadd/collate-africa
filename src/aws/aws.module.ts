import { Module } from '@nestjs/common';
import { AwsConfigService } from 'src/config/aws.config';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService, AwsConfigService, ],
  exports: [AwsService],
})
export class AwsModule {}
