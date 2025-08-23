import { MigrationInterface, QueryRunner } from "typeorm";

export class SerialNumber1755561568667 implements MigrationInterface {
    name = 'SerialNumber1755561568667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" ADD "serial_number" character varying`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "serial_number"`);
    }

}
