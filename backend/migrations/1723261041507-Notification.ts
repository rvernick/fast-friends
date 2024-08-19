import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1723261041507 implements MigrationInterface {
    name = 'Notification1723261041507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('created', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "status" "public"."notification_status_enum" NOT NULL DEFAULT 'created', "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_maintenance_items_maintenance_item" ("notificationId" integer NOT NULL, "maintenanceItemId" integer NOT NULL, CONSTRAINT "PK_dde739555dfa868230bb606d841" PRIMARY KEY ("notificationId", "maintenanceItemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13e9018d60b73504cd2a3e6f25" ON "notification_maintenance_items_maintenance_item" ("notificationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_66796afe54e168560c909bf0e1" ON "notification_maintenance_items_maintenance_item" ("maintenanceItemId") `);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "stravaId"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "bikeDistance"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "dueDistance"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "part" "public"."maintenance_item_part_enum" NOT NULL DEFAULT 'Chain'`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "lastPerformedDistanceMeters" integer`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "dueDistanceMeters" integer`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "dueDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "odometerMeters" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "model" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_maintenance_items_maintenance_item" ADD CONSTRAINT "FK_13e9018d60b73504cd2a3e6f258" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_maintenance_items_maintenance_item" ADD CONSTRAINT "FK_66796afe54e168560c909bf0e11" FOREIGN KEY ("maintenanceItemId") REFERENCES "maintenance_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_maintenance_items_maintenance_item" DROP CONSTRAINT "FK_66796afe54e168560c909bf0e11"`);
        await queryRunner.query(`ALTER TABLE "notification_maintenance_items_maintenance_item" DROP CONSTRAINT "FK_13e9018d60b73504cd2a3e6f258"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "model" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "odometerMeters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "dueDistanceMeters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "lastPerformedDistanceMeters"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "part"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "dueDistance" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "bikeDistance" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "stravaId" character varying`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66796afe54e168560c909bf0e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13e9018d60b73504cd2a3e6f25"`);
        await queryRunner.query(`DROP TABLE "notification_maintenance_items_maintenance_item"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
    }

}
