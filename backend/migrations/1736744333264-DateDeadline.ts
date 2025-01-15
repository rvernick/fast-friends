import { MigrationInterface, QueryRunner } from "typeorm";

export class DateDeadline1736744333264 implements MigrationInterface {
    name = 'DateDeadline1736744333264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "default_longevity_days" integer NOT NULL DEFAULT '90'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "default_longevity_days"`);
    }

}
