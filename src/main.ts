import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import dataSource from './typeorm/typeorm.config';

async function bootstrap() {
  const logger = new Logger('AppBootstrap');
  await dataSource.initialize();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  const config = new DocumentBuilder()
    .setTitle('Collate')
    .setDescription('The Collate API description')
    .setVersion('1.0')
    .addTag('Collate')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('monitoring/api-docs', app, document);

  const PORT = process.env.PORT || 4400;
  await app.listen(PORT);
  logger.log(
    `Server Listening on Port [${PORT}] In [${process.env.NODE_ENV}] Mode`,
  );
}
bootstrap();
