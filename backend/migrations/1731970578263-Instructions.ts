import { MigrationInterface, QueryRunner } from "typeorm";

export class Instructions1731970578263 implements MigrationInterface {
    name = 'Instructions1731970578263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "step" ("id" SERIAL NOT NULL, "step_number" integer NOT NULL DEFAULT '0', "name" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "notes" character varying NOT NULL DEFAULT '', "hints" character varying NOT NULL DEFAULT '', "instruction_id" integer, CONSTRAINT "PK_70d386ace569c3d265e05db0cc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tool" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "link" character varying, CONSTRAINT "PK_3bf5b1016a384916073184f99b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tool_need_needed_enum" AS ENUM('Nice to Have', 'Helpful', 'Trivial')`);
        await queryRunner.query(`CREATE TABLE "tool_need" ("id" SERIAL NOT NULL, "needed" "public"."tool_need_needed_enum" NOT NULL DEFAULT 'Trivial', "instruction_id" integer, "toolId" integer NOT NULL, CONSTRAINT "PK_f95bcee47488cabebf4b3d6fd1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instruction_reference" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "link" character varying NOT NULL DEFAULT 'https://www.sheldonbrown.com/', "instruction_id" integer, CONSTRAINT "PK_0dc19bd9be5c36aa640713bb327" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant')`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_action_enum" AS ENUM('Check', 'Clean', 'Lubricate', 'Replace')`);
        await queryRunner.query(`CREATE TYPE "public"."instruction_difficulty_enum" AS ENUM('Trivial', 'Easy', 'Tricky', 'Hard')`);
        await queryRunner.query(`CREATE TABLE "instruction" ("id" SERIAL NOT NULL, "part" "public"."instruction_part_enum" NOT NULL DEFAULT 'Chain', "action" "public"."instruction_action_enum" NOT NULL DEFAULT 'Replace', "difficulty" "public"."instruction_difficulty_enum" NOT NULL DEFAULT 'Easy', "hints" character varying NOT NULL DEFAULT '', "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd8def68dee37e3f878d0f8673a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_317f44f8a9d076579cfa32eb8c" ON "instruction" ("part", "action") `);
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_item_part_enum" RENAME TO "maintenance_item_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" TYPE "public"."maintenance_item_part_enum" USING "part"::"text"::"public"."maintenance_item_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_part_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum" RENAME TO "maintenance_history_part_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_history_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant')`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" TYPE "public"."maintenance_history_part_enum" USING "part"::"text"::"public"."maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "part" SET DEFAULT 'Chain'`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_history_part_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
        await queryRunner.query(`ALTER TABLE "step" ADD CONSTRAINT "FK_b5d1ca5b56d4b8f50f7fd844129" FOREIGN KEY ("instruction_id") REFERENCES "instruction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tool_need" ADD CONSTRAINT "FK_5f098ae8abe5363d7c30c59a874" FOREIGN KEY ("instruction_id") REFERENCES "instruction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tool_need" ADD CONSTRAINT "FK_457494030662d1c51732c556427" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instruction_reference" ADD CONSTRAINT "FK_ce34343d9f4a7d9d5c82483438d" FOREIGN KEY ("instruction_id") REFERENCES "instruction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instruction_reference" DROP CONSTRAINT "FK_ce34343d9f4a7d9d5c82483438d"`);
        await queryRunner.query(`ALTER TABLE "tool_need" DROP CONSTRAINT "FK_457494030662d1c51732c556427"`);
        await queryRunner.query(`ALTER TABLE "tool_need" DROP CONSTRAINT "FK_5f098ae8abe5363d7c30c59a874"`);
        await queryRunner.query(`ALTER TABLE "step" DROP CONSTRAINT "FK_b5d1ca5b56d4b8f50f7fd844129"`);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_317f44f8a9d076579cfa32eb8c"`);
        await queryRunner.query(`DROP TABLE "instruction"`);
        await queryRunner.query(`DROP TYPE "public"."instruction_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."instruction_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."instruction_part_enum"`);
        await queryRunner.query(`DROP TABLE "instruction_reference"`);
        await queryRunner.query(`DROP TABLE "tool_need"`);
        await queryRunner.query(`DROP TYPE "public"."tool_need_needed_enum"`);
        await queryRunner.query(`DROP TABLE "tool"`);
        await queryRunner.query(`DROP TABLE "step"`);
    }

}
