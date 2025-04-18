import { MigrationInterface, QueryRunner } from "typeorm";

export class BasisRefactor1744608297251 implements MigrationInterface {
    name = 'BasisRefactor1744608297251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bike_definition_basis" ("id" SERIAL NOT NULL, "json" jsonb, "query" character varying, "bike_def_id" integer, CONSTRAINT "PK_3ea7ffad8969ecabc7b10089b9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "basis"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "basis_json" jsonb`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "bike_definition_basis_id" integer`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "UQ_b3c4af892d6fbcac748e45bd5aa" UNIQUE ("bike_definition_basis_id")`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "brand" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "model" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "line" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "year" integer`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "bike_definition_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10bb050db0d6e8068d3e9713f"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "search_string"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_string","migration_builder","public","bike_definition"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "search_string" character varying GENERATED ALWAYS AS (lower(brand) || lower(model) || lower(line)) STORED NOT NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["migration_builder","public","bike_definition","GENERATED_COLUMN","search_string","lower(brand) || lower(model) || lower(line)"]);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`CREATE INDEX "IDX_a10bb050db0d6e8068d3e9713f" ON "bike_definition" ("search_string") `);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "FK_b3c4af892d6fbcac748e45bd5aa" FOREIGN KEY ("bike_definition_basis_id") REFERENCES "bike_definition_basis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_272badd9f4464926932a531a548" FOREIGN KEY ("bike_definition_id") REFERENCES "bike_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_272badd9f4464926932a531a548"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "FK_b3c4af892d6fbcac748e45bd5aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10bb050db0d6e8068d3e9713f"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_string","migration_builder","public","bike_definition"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "search_string"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["migration_builder","public","bike_definition","GENERATED_COLUMN","search_string","'year' || 'brand' || 'model' || 'line'"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "search_string" character varying GENERATED ALWAYS AS ('year' || 'brand' || 'model' || 'line') STORED NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a10bb050db0d6e8068d3e9713f" ON "bike_definition" ("search_string") `);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "bike_definition_id"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "line"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "UQ_b3c4af892d6fbcac748e45bd5aa"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "bike_definition_basis_id"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "basis_json"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "basis" jsonb`);
        await queryRunner.query(`DROP TABLE "bike_definition_basis"`);
    }

}
