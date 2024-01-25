import { MigrationInterface, QueryRunner } from "typeorm";

export class partiesEntity1678447138420 implements MigrationInterface {
    name = 'partiesEntity1678447138420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partyId" character varying NOT NULL, "partyName" character varying NOT NULL, "partyAcronym" character varying NOT NULL, "partyLogo" character varying NOT NULL, CONSTRAINT "PK_da698299dca60d55f0050dde935" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "parties"`);
    }

}
