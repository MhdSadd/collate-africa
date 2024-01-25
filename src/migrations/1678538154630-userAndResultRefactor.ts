import { MigrationInterface, QueryRunner } from "typeorm";

export class userAndResultRefactor1678538154630 implements MigrationInterface {
    name = 'userAndResultRefactor1678538154630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "party_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partyId" character varying NOT NULL, "vote" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "resultIdId" uuid, CONSTRAINT "PK_e35bd1073dab41d3396828c46e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "result"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "resultURL" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "party_result" ADD CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc" FOREIGN KEY ("resultIdId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_result" DROP CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "resultURL"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "result" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "party_result"`);
    }

}
