import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableToken1710091129185 implements MigrationInterface {
    name = 'CreateTableToken1710091129185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tokens_token_type_enum" AS ENUM('0')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" BIGSERIAL NOT NULL, "token_jwt" character varying NOT NULL, "token_type" "public"."tokens_token_type_enum" NOT NULL, "revoked" boolean NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_token_type_enum"`);
    }

}
