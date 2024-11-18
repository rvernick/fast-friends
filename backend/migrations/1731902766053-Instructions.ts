import { MigrationInterface, QueryRunner } from "typeorm";

export class Instructions1731902766053 implements MigrationInterface {
    name = 'Instructions1731902766053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum" RENAME TO "maintenance_item_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum" USING "part"::"text"::"public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum" RENAME TO "maintenance_history_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" TYPE "public"."maintenance_history_part_enum" USING "part"::"text"::"public"."maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum_old" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" TYPE "public"."maintenance_history_part_enum_old" USING "part"::"text"::"public"."maintenance_history_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum_old" RENAME TO "maintenance_history_part_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum_old" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum_old" USING "part"::"text"::"public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum_old" RENAME TO "maintenance_item_part_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
    }

}
