import * as dotenv from 'dotenv';
dotenv.config();
import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartiesSeeder } from './parties.seeder';
import { Parties } from '../result/entities';

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  CA_CERT,
  NODE_ENV,
} = process.env;

seeder({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: DB_HOST,
        port: +DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        ssl:
          NODE_ENV === 'prod'
            ? {
                requestCert: true,
                rejectUnauthorized: true,
                ca: CA_CERT,
              }
            : undefined,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([Parties]),
  ],
}).run([PartiesSeeder]);
