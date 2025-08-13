import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserIdFromBike1755086582665 implements MigrationInterface {
    name = 'DropUserIdFromBike1755086582665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "photo_url"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed"`);
        await queryRunner.query(`ALTER TABLE "bike" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "bike" ALTER COLUMN "user_id" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "photo_url" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "userId" integer NOT NULL`);
    }

}
