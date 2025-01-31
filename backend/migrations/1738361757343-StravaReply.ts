import { MigrationInterface, QueryRunner } from "typeorm";

export class StravaReply1738361757343 implements MigrationInterface {
    name = 'StravaReply1738361757343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "strava_verify" ("id" SERIAL NOT NULL, "code" character varying NOT NULL DEFAULT '000000', "expires_on" TIMESTAMP NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_4f84b036584b7f5c3dc927ce810" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`ALTER TABLE "strava_verify" ADD CONSTRAINT "FK_22fca3787e413b114b04907eaa4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strava_verify" DROP CONSTRAINT "FK_22fca3787e413b114b04907eaa4"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`DROP TABLE "strava_verify"`);
    }

}
