import { MigrationInterface, QueryRunner } from "typeorm";

export class S3Media1754954576574 implements MigrationInterface {
    name = 'S3Media1754954576574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."s3_media_type_enum" AS ENUM('photo', 'video', 'pdf')`);
        await queryRunner.query(`CREATE TABLE "s3_media" ("id" SERIAL NOT NULL, "type" "public"."s3_media_type_enum" NOT NULL DEFAULT 'photo', "user_id" integer NOT NULL, "bucket" character varying NOT NULL, "key" character varying NOT NULL, "presigned_url" character varying, "url_expires" TIMESTAMP, "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5141129e7fbf3b6637cb92704a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9e9278aae526892c77387c74c4" ON "s3_media" ("bucket", "key") `);
        await queryRunner.query(`ALTER TABLE "bike" ADD "user_id" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "photo_url" character varying`);
        await queryRunner.query(`ALTER TABLE "bike" ADD "bike_photo_id" integer`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "UQ_290e9c78b93890bd1eec34cf0e0" UNIQUE ("bike_photo_id")`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_290e9c78b93890bd1eec34cf0e0" FOREIGN KEY ("bike_photo_id") REFERENCES "s3_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_290e9c78b93890bd1eec34cf0e0"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "UQ_290e9c78b93890bd1eec34cf0e0"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "bike_photo_id"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "photo_url"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP COLUMN "user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e9278aae526892c77387c74c4"`);
        await queryRunner.query(`DROP TABLE "s3_media"`);
        await queryRunner.query(`DROP TYPE "public"."s3_media_type_enum"`);
    }

}
