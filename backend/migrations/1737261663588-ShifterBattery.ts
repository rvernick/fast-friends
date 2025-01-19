import { MigrationInterface, QueryRunner } from "typeorm";

export class ShifterBattery1737261663588 implements MigrationInterface {
    name = 'ShifterBattery1737261663588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum" RENAME TO "maintenance_item_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum" USING "part"::"text"::"public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum" RENAME TO "maintenance_history_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery')`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" TYPE "public"."maintenance_history_part_enum" USING "part"::"text"::"public"."maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum_old"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_317f44f8a9d076579cfa32eb8c"`);
        await queryRunner.query(`ALTER TYPE "public"."instruction_part_enum" RENAME TO "instruction_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery')`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" TYPE "public"."instruction_part_enum" USING "part"::"text"::"public"."instruction_part_enum"`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."instruction_part_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."help_request_part_enum" RENAME TO "help_request_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery')`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" TYPE "public"."help_request_part_enum" USING "part"::"text"::"public"."help_request_part_enum"`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."help_request_part_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_317f44f8a9d076579cfa32eb8c" ON "instruction" ("part", "action") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_317f44f8a9d076579cfa32eb8c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" TYPE "public"."help_request_part_enum_old" USING "part"::"text"::"public"."help_request_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."help_request_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."help_request_part_enum_old" RENAME TO "help_request_part_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" TYPE "public"."instruction_part_enum_old" USING "part"::"text"::"public"."instruction_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."instruction_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."instruction_part_enum_old" RENAME TO "instruction_part_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_317f44f8a9d076579cfa32eb8c" ON "instruction" ("part", "action") `);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" TYPE "public"."maintenance_history_part_enum_old" USING "part"::"text"::"public"."maintenance_history_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum_old" RENAME TO "maintenance_history_part_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum_old" USING "part"::"text"::"public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum_old" RENAME TO "maintenance_item_part_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
    }

}
