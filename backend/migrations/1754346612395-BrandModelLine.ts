import { MigrationInterface, QueryRunner } from "typeorm";

export class BrandModelLine1754346612395 implements MigrationInterface {
    name = 'BrandModelLine1754346612395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" ADD "brand" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "model" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "line" character varying`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "year" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "year" character varying`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "year" integer`);
        await queryRunner.query(`ALTER TABLE "bike_definition" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "bike_definition" ADD "year" integer`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "line"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "brand"`);
    }

}
