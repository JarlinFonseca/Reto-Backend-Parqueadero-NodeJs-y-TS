import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableToken1710098846237 implements MigrationInterface {
    name = 'ChangeTableToken1710098846237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."tokens_token_type_enum" RENAME TO "tokens_token_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tokens_token_type_enum" AS ENUM('BEARER')`);
        await queryRunner.query(`ALTER TABLE "tokens" ALTER COLUMN "token_type" TYPE "public"."tokens_token_type_enum" USING "token_type"::"text"::"public"."tokens_token_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_token_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tokens_token_type_enum_old" AS ENUM('0')`);
        await queryRunner.query(`ALTER TABLE "tokens" ALTER COLUMN "token_type" TYPE "public"."tokens_token_type_enum_old" USING "token_type"::"text"::"public"."tokens_token_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_token_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tokens_token_type_enum_old" RENAME TO "tokens_token_type_enum"`);
    }

}
