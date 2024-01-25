import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableIP1677680125485 implements MigrationInterface {
  name = 'NullableIP1677680125485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" ALTER COLUMN "ip" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" ALTER COLUMN "ip" SET NOT NULL`,
    );
  }
}
