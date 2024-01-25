import { Global, Module } from '@nestjs/common';
import { CheckBucketExist } from 'src/utils/check-bucket-exist';
import { DoSpacesServiceProvider } from './dospaces.config';
import { DospacesService } from './dospaces.service';

@Global()
@Module({
  providers: [DospacesService, DoSpacesServiceProvider, CheckBucketExist],
  exports: [DospacesService],
})
export class DospacesModule {}
