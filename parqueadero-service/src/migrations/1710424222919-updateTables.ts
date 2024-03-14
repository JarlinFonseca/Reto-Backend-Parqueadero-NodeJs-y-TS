import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1710424222919 implements MigrationInterface {
    name = 'UpdateTables1710424222919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at " TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "created_at "`);
    }

}
