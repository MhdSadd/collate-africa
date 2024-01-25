import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, SYNCHRONIZE } =
  process.env;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: DB_HOST,
        port: +DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        entities: [],
        synchronize: JSON.parse(SYNCHRONIZE),
        ssl:
          process.env.NODE_ENV === 'prod'
            ? {
                requestCert: true,
                rejectUnauthorized: true,
                ca: process.env.CA_CERT,
              }
            : undefined,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
