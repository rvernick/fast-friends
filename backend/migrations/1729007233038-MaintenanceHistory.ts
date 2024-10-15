import { MigrationInterface, QueryRunner } from "typeorm";

export class MaintenanceHistory1729007233038 implements MigrationInterface {
    name = 'MaintenanceHistory1729007233038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up')`);
        await queryRunner.query(`CREATE TABLE "maintenance_history" ("id" SERIAL NOT NULL, "part" "public"."maintenance_history_part_enum" NOT NULL DEFAULT 'Chain', "distance_meters" integer NOT NULL, "type" character varying, "brand" character varying, "model" character varying, "link" character varying, "deleted_on" TIMESTAMP, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "maintenance_item_id" integer NOT NULL, CONSTRAINT "PK_d8e3fbdcaadbd613b6db4e8f4c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "deletedOn" to "deleted_on"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "createdOn" to "created_on"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "updatedOn" to "updated_on"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "lastPerformedDistanceMeters" to "last_performed_distance_meters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "dueDistanceMeters" to "due_distance_meters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "dueDate" to "due_date"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "was_notified" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "default_longevity" integer NOT NULL DEFAULT '4828032'`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "auto_adjust_longevity" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ADD CONSTRAINT "FK_554246a31f54c4bc9814baec0cc" FOREIGN KEY ("maintenance_item_id") REFERENCES "maintenance_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" DROP CONSTRAINT "FK_554246a31f54c4bc9814baec0cc"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "deleted_on" to "deletedOn"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "created_on" to "createdOn"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "updated_on" to "updatedOn"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "auto_adjust_longevity"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "default_longevity"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "was_notified"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "last_performed_distance_meters" to "lastPerformedDistanceMeters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "due_distance_meters" to  "dueDistanceMeters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" RENAME COLUMN "due_date" to "dueDate"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "maintenance_history"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum"`);
    }

}
