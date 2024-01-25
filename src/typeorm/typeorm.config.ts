import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: `${process.cwd()}/.env` });

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  SYNCHRONIZE,
  NODE_ENV,
  CA_CERT,
} = process.env;

console.log({
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
  CA_CERT,
});

export default new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: JSON.parse(SYNCHRONIZE),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  ssl:
    NODE_ENV === 'prod'
      ? {
          requestCert: true,
          rejectUnauthorized: true,
          ca: CA_CERT,
        }
      : undefined,
  logging: true,
});
