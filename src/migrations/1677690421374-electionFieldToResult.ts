import { MigrationInterface, QueryRunner } from 'typeorm';

export class electionFieldToResult1677690421374 implements MigrationInterface {
  name = 'electionFieldToResult1677690421374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" ADD "election" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "election"`);
  }
}
