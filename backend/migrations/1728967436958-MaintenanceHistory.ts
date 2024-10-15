import { MigrationInterface, QueryRunner } from "typeorm";

export class MaintenanceHistory1728967436958 implements MigrationInterface {
    name = 'MaintenanceHistory1728967436958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "batch_process" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lockedKey" character varying, "lockedOn" TIMESTAMP, "lastRan" TIMESTAMP, "version" integer NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_73cb9b61a02a8e7dbdd52cf3d49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up')`);
        await queryRunner.query(`CREATE TABLE "maintenance_history" ("id" SERIAL NOT NULL, "part" "public"."maintenance_history_part_enum" NOT NULL DEFAULT 'Chain', "distance_meters" integer NOT NULL, "type" character varying, "brand" character varying, "model" character varying, "link" character varying, "deleted_on" TIMESTAMP, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "maintenance_item_id" integer NOT NULL, CONSTRAINT "PK_d8e3fbdcaadbd613b6db4e8f4c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "wasNotified" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "defaultLongevity" integer NOT NULL DEFAULT '4828032'`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "autoAdjustLongevity" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ADD CONSTRAINT "FK_554246a31f54c4bc9814baec0cc" FOREIGN KEY ("maintenance_item_id") REFERENCES "maintenance_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" DROP CONSTRAINT "FK_554246a31f54c4bc9814baec0cc"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "autoAdjustLongevity"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "defaultLongevity"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "wasNotified"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "maintenance_history"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum"`);
        await queryRunner.query(`DROP TABLE "batch_process"`);
    }

}
