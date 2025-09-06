import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSource1757110791771 implements MigrationInterface {
    name = 'UserSource1757110791771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_source_enum" AS ENUM('strava', 'pedal-assistant')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "source" "public"."user_source_enum" NOT NULL DEFAULT 'pedal-assistant'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "source"`);
        await queryRunner.query(`DROP TYPE "public"."user_source_enum"`);
    }

}
