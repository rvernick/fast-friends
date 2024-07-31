import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1722345864900 implements MigrationInterface {
    name = 'Initial1722345864900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "maintenance_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "stravaId" character varying, "type" character varying, "brand" character varying NOT NULL, "model" character varying NOT NULL, "link" character varying NOT NULL, "bikeDistance" integer NOT NULL, "dueDistance" integer NOT NULL, "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "bikeId" integer NOT NULL, CONSTRAINT "PK_3ea3865296588fc9b0b20382c8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bike_groupsetbrand_enum" AS ENUM('Shimano', 'SRAM', 'Campagnolo')`);
        await queryRunner.query(`CREATE TABLE "bike" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "stravaId" character varying, "type" character varying, "groupsetBrand" "public"."bike_groupsetbrand_enum" DEFAULT 'Shimano', "isElectronic" boolean NOT NULL DEFAULT false, "groupsetSpeed" integer, "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_e4a433f76768045f7a2efca66e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "cellPhone" character varying, "stravaCode" character varying, "stravaId" character varying, "stravaRefreshToken" character varying, "stravaAccessToken" character varying, "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expiresOn" TIMESTAMP NOT NULL, "deletedOn" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" ADD CONSTRAINT "FK_2ade8c7303160e52ff0ddadc8b6" FOREIGN KEY ("bikeId") REFERENCES "bike"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_8440b1541aaf3fe1efd1fda510e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"`);
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_8440b1541aaf3fe1efd1fda510e"`);
        await queryRunner.query(`ALTER TABLE "maintenance_item" DROP CONSTRAINT "FK_2ade8c7303160e52ff0ddadc8b6"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "bike"`);
        await queryRunner.query(`DROP TYPE "public"."bike_groupsetbrand_enum"`);
        await queryRunner.query(`DROP TABLE "maintenance_item"`);
    }

}
