import { MigrationInterface, QueryRunner } from "typeorm";

export class addedPUToUserEntity1678559842477 implements MigrationInterface {
    name = 'addedPUToUserEntity1678559842477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pollingUnit" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pollingUnit"`);
    }

}
