import { MigrationInterface, QueryRunner } from "typeorm";

export class HelpRequest1733541912373 implements MigrationInterface {
    name = 'HelpRequest1733541912373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."help_request_part_enum" AS ENUM('Chain', 'Cassette', 'Front Tire', 'Rear Tire', 'Crankset', 'Front Brake Cable', 'Rear Brake Cable', 'Front Brake Pads', 'Rear Brake Pads', 'Front Brake Rotor', 'Rear Brake Rotor', 'Rear Shifter Cable', 'Front Shifter Cable', 'Bar Tape', 'Tune Up', 'Front Suspension', 'Rear Suspension', 'Front Derailleur Battery', 'Rear Derailleur Battery', 'Front Tire Sealant', 'Rear Tire Sealant')`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_action_enum" AS ENUM('Check', 'Clean', 'Lubricate', 'Replace')`);
        await queryRunner.query(`CREATE TYPE "public"."help_request_need_type_enum" AS ENUM('I have a question', 'Double check my work', 'Watch me do it', 'Teach me how to do it')`);
        await queryRunner.query(`CREATE TABLE "help_request" ("id" SERIAL NOT NULL, "part" "public"."help_request_part_enum" NOT NULL DEFAULT 'Chain', "action" "public"."help_request_action_enum" NOT NULL DEFAULT 'Replace', "need_type" "public"."help_request_need_type_enum" NOT NULL DEFAULT 'I have a question', "description" character varying NOT NULL DEFAULT '', "resolved" boolean NOT NULL, "deleted_on" TIMESTAMP, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_166d671334639318e1d6fc6cb8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "help_comment" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "user_id" integer NOT NULL, "help_request_id" integer NOT NULL, CONSTRAINT "PK_cb04309011d7ec342f606647f3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "help_comment_vote" ("id" SERIAL NOT NULL, "flag" boolean NOT NULL DEFAULT false, "up" boolean NOT NULL DEFAULT true, "help_comment_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_7a377ca83bc5a7516c8b25b3b0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."help_offer_qualification_enum" AS ENUM('Professional', 'Avid Amateur', 'Novice', 'Newbie')`);
        await queryRunner.query(`CREATE TABLE "help_offer" ("id" SERIAL NOT NULL, "qualification" "public"."help_offer_qualification_enum" NOT NULL DEFAULT 'Avid Amateur', "help_request_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_552f7c57e055ea6d07c9571ae14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "help_request" ADD CONSTRAINT "FK_4329e6a171e8942aaf95c4869f6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_comment" ADD CONSTRAINT "FK_d7a829f1919bde74b9752e92303" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_comment" ADD CONSTRAINT "FK_33bdde663f9f224b8108ebdfd88" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_comment_vote" ADD CONSTRAINT "FK_88ececd4bee71204fd271903adf" FOREIGN KEY ("help_comment_id") REFERENCES "help_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_comment_vote" ADD CONSTRAINT "FK_52a343fa20f6beb92530caa8787" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_offer" ADD CONSTRAINT "FK_46bb33a8645e1d173498d97f5a8" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "help_offer" ADD CONSTRAINT "FK_a738c6c6044010a7ad483a5d20e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "help_offer" DROP CONSTRAINT "FK_a738c6c6044010a7ad483a5d20e"`);
        await queryRunner.query(`ALTER TABLE "help_offer" DROP CONSTRAINT "FK_46bb33a8645e1d173498d97f5a8"`);
        await queryRunner.query(`ALTER TABLE "help_comment_vote" DROP CONSTRAINT "FK_52a343fa20f6beb92530caa8787"`);
        await queryRunner.query(`ALTER TABLE "help_comment_vote" DROP CONSTRAINT "FK_88ececd4bee71204fd271903adf"`);
        await queryRunner.query(`ALTER TABLE "help_comment" DROP CONSTRAINT "FK_33bdde663f9f224b8108ebdfd88"`);
        await queryRunner.query(`ALTER TABLE "help_comment" DROP CONSTRAINT "FK_d7a829f1919bde74b9752e92303"`);
        await queryRunner.query(`ALTER TABLE "help_request" DROP CONSTRAINT "FK_4329e6a171e8942aaf95c4869f6"`);
        await queryRunner.query(`DROP TABLE "help_offer"`);
        await queryRunner.query(`DROP TYPE "public"."help_offer_qualification_enum"`);
        await queryRunner.query(`DROP TABLE "help_comment_vote"`);
        await queryRunner.query(`DROP TABLE "help_comment"`);
        await queryRunner.query(`DROP TABLE "help_request"`);
        await queryRunner.query(`DROP TYPE "public"."help_request_need_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."help_request_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."help_request_part_enum"`);
    }

}
