import { MigrationInterface, QueryRunner } from "typeorm";

export class EditHistory1737839113310 implements MigrationInterface {
    name = 'EditHistory1737839113310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" RENAME COLUMN "part" TO "done_date"`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_part_enum" RENAME TO "maintenance_history_done_date_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" DROP COLUMN "done_date"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ADD "done_date" TIMESTAMP NOT NULL DEFAULT '1/1/1970'`);
        await queryRunner.query(`update maintenance_history mh SET done_date = mh.created_on where done_date = '1970-01-01 00:00:00+00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_history" DROP COLUMN "done_date"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ADD "done_date" "public"."maintenance_history_done_date_enum" NOT NULL DEFAULT 'Chain'`);
        await queryRunner.query(`ALTER TYPE "public"."maintenance_history_done_date_enum" RENAME TO "maintenance_history_part_enum"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" RENAME COLUMN "done_date" TO "part"`);
    }

}
