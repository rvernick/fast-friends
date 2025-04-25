import { MigrationInterface, QueryRunner } from "typeorm";

export class BikeDefinitionRefactor1745541974404 implements MigrationInterface {
    name = 'BikeDefinitionRefactor1745541974404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bike_definition_basis" ("id" SERIAL NOT NULL, "json" jsonb, "query" character varying, "bike_def_id" integer, CONSTRAINT "PK_3ea7ffad8969ecabc7b10089b9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "model" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "brand_id" integer NOT NULL, CONSTRAINT "PK_d6df271bba301d5cc79462912a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "line" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "model_id" integer NOT NULL, CONSTRAINT "PK_3d944a608f62f599dfe688ff2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "basis"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "line"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "brand_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "model_name" character varying`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "line_name" character varying`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "basis_json" jsonb`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "brand_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "model_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "line_id" integer`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "bike_definition_basis_id" integer`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "UQ_b3c4af892d6fbcac748e45bd5aa" UNIQUE ("bike_definition_basis_id")`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "year" integer`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "bike_definition_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10bb050db0d6e8068d3e9713f"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "search_string"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_string","migration_builder","public","bike_definition"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "search_string" character varying GENERATED ALWAYS AS (lower(brand_name) || lower(model_name) || lower(line_name)) STORED NOT NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["migration_builder","public","bike_definition","GENERATED_COLUMN","search_string","lower(brand_name) || lower(model_name) || lower(line_name)"]);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`CREATE INDEX "IDX_a10bb050db0d6e8068d3e9713f" ON "bike_definition" ("search_string") `);
        await queryRunner.query(`ALTER TABLE "model" ADD CONSTRAINT "FK_1c9fa70a2a9da326c507e3fead5" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line" ADD CONSTRAINT "FK_74dafcdd4e1ae66e4bcb933e6bf" FOREIGN KEY ("model_id") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "FK_4ca8e39570f3212695f4922818f" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "FK_480e6d9d4f6b90c980252b08cbd" FOREIGN KEY ("model_id") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "FK_cb7eb23f9dca550ac6f16fd3502" FOREIGN KEY ("line_id") REFERENCES "line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD CONSTRAINT "FK_b3c4af892d6fbcac748e45bd5aa" FOREIGN KEY ("bike_definition_basis_id") REFERENCES "bike_definition_basis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_272badd9f4464926932a531a548" FOREIGN KEY ("bike_definition_id") REFERENCES "bike_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_272badd9f4464926932a531a548"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "FK_b3c4af892d6fbcac748e45bd5aa"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "FK_cb7eb23f9dca550ac6f16fd3502"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "FK_480e6d9d4f6b90c980252b08cbd"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "FK_4ca8e39570f3212695f4922818f"`);
        await queryRunner.query(`ALTER TABLE "line" DROP CONSTRAINT "FK_74dafcdd4e1ae66e4bcb933e6bf"`);
        await queryRunner.query(`ALTER TABLE "model" DROP CONSTRAINT "FK_1c9fa70a2a9da326c507e3fead5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10bb050db0d6e8068d3e9713f"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_string","migration_builder","public","bike_definition"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "search_string"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["migration_builder","public","bike_definition","GENERATED_COLUMN","search_string","'year' || 'brand' || 'model' || 'line'"]);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "search_string" character varying GENERATED ALWAYS AS ('year' || 'brand' || 'model' || 'line') STORED NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a10bb050db0d6e8068d3e9713f" ON "bike_definition" ("search_string") `);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "bike_definition_id"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP CONSTRAINT "UQ_b3c4af892d6fbcac748e45bd5aa"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "bike_definition_basis_id"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "line_id"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "model_id"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "brand_id"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "basis_json"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "line_name"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "model_name"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "brand_name"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "line" character varying`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "model" character varying`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "brand" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "basis" jsonb`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`DROP TABLE "model"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "bike_definition_basis"`);
    }

}
