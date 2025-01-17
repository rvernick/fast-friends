import { MigrationInterface, QueryRunner } from "typeorm";

export class PushToken1737044385988 implements MigrationInterface {
    name = 'PushToken1737044385988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pushToken" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('email', 'sms', 'push')`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" "public"."notification_type_enum" NOT NULL DEFAULT 'email'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushToken"`);
    }

}
