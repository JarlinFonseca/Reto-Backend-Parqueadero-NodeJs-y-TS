import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1710007389254 implements MigrationInterface {
    name = 'CreateTables1710007389254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" BIGSERIAL NOT NULL, "placa" character varying NOT NULL, CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_lots_vehicles" ("id" BIGSERIAL NOT NULL, "created_entry" TIMESTAMP NOT NULL DEFAULT now(), "active_entry_flag" boolean NOT NULL, "parking_lot_id" bigint NOT NULL, "vehicle_id" bigint NOT NULL, CONSTRAINT "PK_e81a76ddcd78b5a705c4c484e83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "history" ("id" BIGSERIAL NOT NULL, "total_payment" integer NOT NULL, "entry_date" TIMESTAMP NOT NULL, "departure_date" TIMESTAMP NOT NULL, "parking_lot_vehicle_id" bigint NOT NULL, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parking_lots_vehicles" ADD CONSTRAINT "FK_712174174f0ae08668915403b27" FOREIGN KEY ("parking_lot_id") REFERENCES "parking_lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_lots_vehicles" ADD CONSTRAINT "FK_42d77c9def5b8f66bda919faa59" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_22f45736119a20929d47aa5af60" FOREIGN KEY ("parking_lot_vehicle_id") REFERENCES "parking_lots_vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_22f45736119a20929d47aa5af60"`);
        await queryRunner.query(`ALTER TABLE "parking_lots_vehicles" DROP CONSTRAINT "FK_42d77c9def5b8f66bda919faa59"`);
        await queryRunner.query(`ALTER TABLE "parking_lots_vehicles" DROP CONSTRAINT "FK_712174174f0ae08668915403b27"`);
        await queryRunner.query(`DROP TABLE "history"`);
        await queryRunner.query(`DROP TABLE "parking_lots_vehicles"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
