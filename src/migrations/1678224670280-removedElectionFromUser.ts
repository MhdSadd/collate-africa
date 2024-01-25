import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedElectionFromUser1678224670280
  implements MigrationInterface
{
  name = 'removedElectionFromUser1678224670280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "election"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "election" character varying NOT NULL`,
    );
  }
}
