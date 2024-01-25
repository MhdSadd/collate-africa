import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DospacesModule } from './dospaces/dospaces.module';
import { ResultModule } from './result/result.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AwsConfigService } from './config/aws.config';
import { AwsModule } from './aws/aws.module';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(),
    DatabaseModule,
    DospacesModule,
    ResultModule,
    UserModule,
    AuthModule,
    AwsModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AwsConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  exports: [AwsConfigService],
})
export class AppModule {}
