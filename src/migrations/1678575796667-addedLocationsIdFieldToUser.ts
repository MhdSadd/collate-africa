import { MigrationInterface, QueryRunner } from "typeorm";

export class addedLocationsIdFieldToUser1678575796667 implements MigrationInterface {
    name = 'addedLocationsIdFieldToUser1678575796667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stateId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "LGAId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "wardId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pollingUnitId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "pollingUnit" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "pollingUnit" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pollingUnitId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wardId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "LGAId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stateId"`);
    }

}
