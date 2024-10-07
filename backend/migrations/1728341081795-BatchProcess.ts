import { MigrationInterface, QueryRunner } from "typeorm";

export class BatchProcess1728341081795 implements MigrationInterface {
    name = 'BatchProcess1728341081795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "batch_process" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lockedKey" character varying, "lockedOn" TIMESTAMP, "lastRan" TIMESTAMP, "version" integer NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_73cb9b61a02a8e7dbdd52cf3d49" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "batch_process"`);
    }

}
