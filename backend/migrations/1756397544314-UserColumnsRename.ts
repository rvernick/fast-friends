import { MigrationInterface, QueryRunner } from "typeorm";

export class UserColumnsRename1756397544314 implements MigrationInterface {
    name = 'UserColumnsRename1756397544314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_080ca8dca167b57fa6a0647425"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "deletedOn" to deleted_on`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "createdOn" to "created_on"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "updatedOn" to "updated_on"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" to "first_name`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "lastName" to "last_name"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "cellPhone" to "cell_phone"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stravaCode" to "strava_code"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stravaId" to "strava_id"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stravaRefreshToken" to "strava_refresh_token"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stravaAccessToken" to "strava_access_token"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "pushToken" to "push_token"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0b33c005169ece07993b15f7b0" ON "user" ("username", "deleted_on") `);
        await queryRunner.query(`ALTER TABLE "o_auth_verify" ADD CONSTRAINT "FK_3e29acc17d4f5933192ec6d2311" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "o_auth_verify" DROP CONSTRAINT "FK_3e29acc17d4f5933192ec6d2311"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0b33c005169ece07993b15f7b0"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "deleted_on" to deletedOn`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "created_on" to "createdOn"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "updated_on" to "updatedOn"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "first_name" to "firstName`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "last_name" to "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "cell_phone" to "cellPhone"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "strava_code" to "stravaCode"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "strava_id" to "stravaId"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "strava_refresh_token" to "stravaRefreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "strava_access_token" to "stravaAccessToken"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "push_token" to "pushToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_080ca8dca167b57fa6a0647425" ON "user" ("username", "deletedOn") `);
    }

}
