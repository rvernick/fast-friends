import { MigrationInterface, QueryRunner } from "typeorm";

export class BikeDefinition1743329076057 implements MigrationInterface {
    name = 'BikeDefinition1743329076057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bike_definition_material_enum" AS ENUM('Carbon', 'Alloy', 'Steel', 'Titanium', 'Bamboo')`);
        await queryRunner.query(`CREATE TYPE "public"."bike_definition_groupset_brand_enum" AS ENUM('Shimano', 'SRAM', 'Campagnolo')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["migration_builder","public","bike_definition","GENERATED_COLUMN","search_string","'year' || 'brand' || 'model' || 'line'"]);
        await queryRunner.query(`CREATE TABLE "bike_definition" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, "model" character varying, "line" character varying, "year" integer, "search_string" character varying GENERATED ALWAYS AS ('year' || 'brand' || 'model' || 'line') STORED NOT NULL, "description" character varying, "colors" text NOT NULL, "sizes" text NOT NULL, "electric_assist" boolean NOT NULL DEFAULT false, "product_link" character varying, "type" character varying, "material" "public"."bike_definition_material_enum" DEFAULT 'Carbon', "materialDescription" character varying, "groupset_brand" "public"."bike_definition_groupset_brand_enum" DEFAULT 'Shimano', "groupset_line" character varying NOT NULL DEFAULT false, "groupsetSpeed" integer, "basis" jsonb, "deleted_on" TIMESTAMP, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0e9682932e17276b8cf60335d0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a10bb050db0d6e8068d3e9713f" ON "bike_definition" ("search_string") `);
        await queryRunner.query(`CREATE TYPE "public"."bike_component_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery', 'Front Wheel', 'Rear Wheel', 'Pedals', 'Front Shifter', 'Rear Shifter', 'Front Brake', 'Rear Brake')`);
        await queryRunner.query(`CREATE TABLE "bike_component" ("id" SERIAL NOT NULL, "part" "public"."bike_component_part_enum" NOT NULL DEFAULT 'Chain', "brand" character varying NOT NULL, "model" character varying, "line" character varying, "product_link" character varying, "type" character varying, "size" character varying, "speeds" character varying, "cog_configuration" character varying, "chainring_count" character varying, "chainring_sizes" character varying, "disc" boolean, "hydraulic" boolean, "thru_axle" boolean, "quick_release" boolean, "tubeless_ready" boolean, "clincher" boolean, "tubular" boolean, "hookless" boolean, "electronic" boolean, "wireless" boolean, "ground_speed" integer, "deleted_on" TIMESTAMP, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "bike_definition_id" integer NOT NULL, CONSTRAINT "PK_6e7fafadf4bf0075b466366e78e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum" RENAME TO "maintenance_item_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery', 'Front Wheel', 'Rear Wheel', 'Pedals', 'Front Shifter', 'Rear Shifter', 'Front Brake', 'Rear Brake')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum" USING "part"::"text"::"public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_317f44f8a9d076579cfa32eb8c"`);
        await queryRunner.query(`ALTER TYPE "public"."instruction_part_enum" RENAME TO "instruction_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery', 'Front Wheel', 'Rear Wheel', 'Pedals', 'Front Shifter', 'Rear Shifter', 'Front Brake', 'Rear Brake')`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" TYPE "public"."instruction_part_enum" USING "part"::"text"::"public"."instruction_part_enum"`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."instruction_part_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."help_request_part_enum" RENAME TO "help_request_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant', 'Left Shifter Battery', 'Right Shifter Battery', 'Front Wheel', 'Rear Wheel', 'Pedals', 'Front Shifter', 'Rear Shifter', 'Front Brake', 'Rear Brake')`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" TYPE "public"."help_request_part_enum" USING "part"::"text"::"public"."help_request_part_enum"`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."help_request_part_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_080ca8dca167b57fa6a0647425" ON "user" ("username", "deletedOn") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_317f44f8a9d076579cfa32eb8c" ON "instruction" ("part", "action") `);
        await queryRunner.query(`ALTER TABLE "bike_component" ADD CONSTRAINT "FK_125d88877e62e187100cea03003" FOREIGN KEY ("bike_definition_id") REFERENCES "bike_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike_component" DROP CONSTRAINT "FK_125d88877e62e187100cea03003"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_317f44f8a9d076579cfa32eb8c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_080ca8dca167b57fa6a0647425"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Left Shifter Battery', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Right Shifter Battery', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" TYPE "public"."help_request_part_enum_old" USING "part"::"text"::"public"."help_request_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "help_request" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."help_request_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."help_request_part_enum_old" RENAME TO "help_request_part_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Left Shifter Battery', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Right Shifter Battery', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" TYPE "public"."instruction_part_enum_old" USING "part"::"text"::"public"."instruction_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "instruction" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."instruction_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."instruction_part_enum_old" RENAME TO "instruction_part_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_317f44f8a9d076579cfa32eb8c" ON "instruction" ("part", "action") `);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum_old" AS ENUM('Bar Tape', 'Cassette', 'Chain', 'Crankset', 'Front Brake Cable', 'Front Brake Pads', 'Front Brake Rotor', 'Front Derailleur Battery', 'Front Shifter Cable', 'Front Suspension', 'Front Tire', 'Front Tire Sealant', 'Left Shifter Battery', 'Rear Brake Cable', 'Rear Brake Pads', 'Rear Brake Rotor', 'Rear Derailleur Battery', 'Rear Shifter Cable', 'Rear Suspension', 'Rear Tire', 'Rear Tire Sealant', 'Right Shifter Battery', 'Tune Up')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum_old" USING "part"::"text"::"public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum_old" RENAME TO "maintenance_item_part_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
        await queryRunner.query(`DROP TABLE "bike_component"`);
        await queryRunner.query(`DROP TYPE "public"."bike_component_part_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10bb050db0d6e8068d3e9713f"`);
        await queryRunner.query(`DROP TABLE "bike_definition"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_string","migration_builder","public","bike_definition"]);
        await queryRunner.query(`DROP TYPE "public"."bike_definition_groupset_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bike_definition_material_enum"`);
    }

}
