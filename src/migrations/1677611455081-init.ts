import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1677611455081 implements MigrationInterface {
  name = 'init1677611455081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" character varying NOT NULL, "LGA" character varying NOT NULL, "ward" character varying NOT NULL, "polling_unit" character varying NOT NULL, "result" character varying NOT NULL, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "result"`);
  }
}
