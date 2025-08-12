import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdRename1755006870054 implements MigrationInterface {
    name = 'UserIdRename1755006870054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_8440b1541aaf3fe1efd1fda510e"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1/1/1970'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bike" DROP CONSTRAINT "FK_dc71fb952a2ba5b88381e0a02ed"`);
        await queryRunner.query(`ALTER TABLE "maintenance_history" ALTER COLUMN "done_date" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "bike" ADD CONSTRAINT "FK_8440b1541aaf3fe1efd1fda510e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
