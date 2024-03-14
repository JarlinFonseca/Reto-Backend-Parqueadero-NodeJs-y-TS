import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableTokensV21710106323936 implements MigrationInterface {
    name = 'ChangeTableTokensV21710106323936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "identificator" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "UQ_b7eb06b281626eb0cbc7c92f407" UNIQUE ("identificator")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "UQ_b7eb06b281626eb0cbc7c92f407"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "identificator"`);
    }

}
