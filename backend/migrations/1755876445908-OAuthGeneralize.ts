import { MigrationInterface, QueryRunner } from "typeorm";

export class OAuthGeneralize1755876445908 implements MigrationInterface {
    name = 'OAuthGeneralize1755876445908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "o_auth_verify" ("id" SERIAL NOT NULL, "code" character varying NOT NULL DEFAULT '000000', "target" character varying NOT NULL DEFAULT 'strava', "expires_on" TIMESTAMP NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_9d988358a35030f09a97f84399d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "o_auth_verify" ADD CONSTRAINT "FK_3e29acc17d4f5933192ec6d2311" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "o_auth_verify" DROP CONSTRAINT "FK_3e29acc17d4f5933192ec6d2311"`);
        await queryRunner.query(`DROP TABLE "o_auth_verify"`);
    }

}
