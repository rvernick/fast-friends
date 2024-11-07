import { MigrationInterface, QueryRunner } from "typeorm";

export class Units1730931422116 implements MigrationInterface {
    name = 'Units1730931422116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_units_enum" AS ENUM('km', 'miles')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "units" "public"."user_units_enum" NOT NULL DEFAULT 'miles'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "units"`);
        await queryRunner.query(`DROP TYPE "public"."user_units_enum"`);
    }

}
