import { MigrationInterface, QueryRunner } from "typeorm";

export class partyAcronymToPartyResults1678737413935 implements MigrationInterface {
    name = 'partyAcronymToPartyResults1678737413935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_result" ADD "partyAcronym" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_result" DROP COLUMN "partyAcronym"`);
    }

}
