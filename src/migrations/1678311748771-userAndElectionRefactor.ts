import { MigrationInterface, QueryRunner } from 'typeorm';

export class userAndElectionRefactor1678311748771
  implements MigrationInterface
{
  name = 'userAndElectionRefactor1678311748771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "polling_unit"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiration"`);
    await queryRunner.query(`ALTER TABLE "result" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "result" ADD CONSTRAINT "FK_601be29c4bf75f59d0261f769ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`,
    );
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "expiration" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "otp" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "polling_unit" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
  }
}
