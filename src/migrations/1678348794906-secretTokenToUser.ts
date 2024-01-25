import { MigrationInterface, QueryRunner } from 'typeorm';

export class secretTokenToUser1678348794906 implements MigrationInterface {
  name = 'secretTokenToUser1678348794906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "secretToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secretToken"`);
  }
}
