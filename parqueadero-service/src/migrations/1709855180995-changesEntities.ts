import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesEntities1709855180995 implements MigrationInterface {
    name = 'ChangesEntities1709855180995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parking_lots" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "quantity_vehicles_maximum" integer NOT NULL, "cost_hour_vehicle" integer NOT NULL, "created_at " TIMESTAMP NOT NULL DEFAULT now(), "user_id" bigint NOT NULL, CONSTRAINT "PK_27af37fbf2f9f525c1db6c20a48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parking_lots" ADD CONSTRAINT "FK_0586116de27cc9f5ad15473b2b8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_lots" DROP CONSTRAINT "FK_0586116de27cc9f5ad15473b2b8"`);
        await queryRunner.query(`DROP TABLE "parking_lots"`);
    }

}
