import { MigrationInterface, QueryRunner } from 'typeorm';

export class userCreateAndResultUpdate1678217990461
  implements MigrationInterface
{
  name = 'userCreateAndResultUpdate1678217990461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phone" character varying, "password" character varying, "state" character varying NOT NULL, "election" character varying NOT NULL, "LGA" character varying NOT NULL, "ward" character varying NOT NULL, "polling_unit" character varying NOT NULL, "otp" character varying NOT NULL, "expiration" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "NnppVotes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "ApgaVotes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "SdpVotes" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "SdpVotes"`);
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "ApgaVotes"`);
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "NnppVotes"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
