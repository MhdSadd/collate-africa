import { MigrationInterface, QueryRunner } from 'typeorm';

export class IPAddress1677679884202 implements MigrationInterface {
  name = 'IPAddress1677679884202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" ADD "ip" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "ip"`);
  }
}
