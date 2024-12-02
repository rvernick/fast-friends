import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerification1733136285176 implements MigrationInterface {
    name = 'EmailVerification1733136285176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verify" ("id" SERIAL NOT NULL, "code" character varying NOT NULL DEFAULT '000000', "expires_on" TIMESTAMP NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_58749aeaa40bfafb1debe261ca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "is_retired" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "email_verify" ADD CONSTRAINT "FK_3017a790807ed097a10e08c83b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_verify" DROP CONSTRAINT "FK_3017a790807ed097a10e08c83b9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "is_retired"`);
        await queryRunner.query(`DROP TABLE "email_verify"`);
    }

}
