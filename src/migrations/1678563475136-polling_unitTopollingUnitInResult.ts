import { MigrationInterface, QueryRunner } from "typeorm";

export class pollingUnitTopollingUnitInResult1678563475136 implements MigrationInterface {
    name = 'pollingUnitTopollingUnitInResult1678563475136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "polling_unit"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "LpVotes"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "ApcVotes"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "PdpVotes"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "NnppVotes"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "ApgaVotes"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "SdpVotes"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "pollingUnit" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "userId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "pollingUnit"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "SdpVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "ApgaVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "NnppVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "PdpVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "ApcVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "LpVotes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "polling_unit" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_601be29c4bf75f59d0261f769ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
