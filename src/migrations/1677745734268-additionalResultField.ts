import { MigrationInterface, QueryRunner } from 'typeorm';

export class additionalResultField1677745734268 implements MigrationInterface {
  name = 'additionalResultField1677745734268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" ADD "total_accredited_voters" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "total_valid_votes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "total_rejected_votes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "LpVotes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "ApcVotes" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD "PdpVotes" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "PdpVotes"`);
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "ApcVotes"`);
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "LpVotes"`);
    await queryRunner.query(
      `ALTER TABLE "result" DROP COLUMN "total_rejected_votes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" DROP COLUMN "total_valid_votes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" DROP COLUMN "total_accredited_voters"`,
    );
  }
}
