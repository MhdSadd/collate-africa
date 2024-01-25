import { MigrationInterface, QueryRunner } from "typeorm";

export class breakOfPoint1679032391895 implements MigrationInterface {
    name = 'breakOfPoint1679032391895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_result" DROP CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc"`);
        await queryRunner.query(`ALTER TABLE "result" RENAME COLUMN "userId" TO "userid"`);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamName" character varying NOT NULL, "description" character varying NOT NULL, "code" character varying NOT NULL, "ownerEmail" character varying NOT NULL, "ownerPhone" character varying NOT NULL, "successMessage" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "teams" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "party_result" ADD CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc" FOREIGN KEY ("resultIdId") REFERENCES "result"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_result" DROP CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "teams"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`ALTER TABLE "result" RENAME COLUMN "userid" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "party_result" ADD CONSTRAINT "FK_4e9f43da79f2882be99b93b02dc" FOREIGN KEY ("resultIdId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
