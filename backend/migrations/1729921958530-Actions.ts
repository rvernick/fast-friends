import { MigrationInterface, QueryRunner } from "typeorm";

export class Actions1729921958530 implements MigrationInterface {
    name = 'Actions1729921958530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."maintenance_item_action_enum" AS ENUM('Check', 'Clean', 'Lubricate', 'Replace')`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD "action" "public"."maintenance_item_action_enum" NOT NULL DEFAULT 'Replace'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89829dde9efb5600ac28c16c83" ON "maintenance_item" ("bikeId", "part", "action") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89829dde9efb5600ac28c16c83"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_item_action_enum"`);
    }

}
