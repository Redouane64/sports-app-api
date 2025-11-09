import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1762700203099 implements MigrationInterface {
  name = 'InitialMigration1762700203099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_agent" character varying, "ip" character varying, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_085d540d9f418cfbdc7bd55bb1" UNIQUE ("user_id"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "full_name" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "location" geography NOT NULL, "route" geometry(LineStringZ,4326) NOT NULL, "total_time" integer, "author_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'DRAFT', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "route" geometry(LineStringZ,4326) NOT NULL, "total_time" integer, "author_id" uuid NOT NULL, "track_id" uuid NOT NULL, "similarity_score" double precision, "status" character varying NOT NULL DEFAULT 'DRAFT', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_0e047e464bd7cb998b71a1dd21f" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_2a7bfcd86c4e9a0d70645bdd6fc" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_8923c0764d22a0d37ddd9324613" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_8923c0764d22a0d37ddd9324613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_2a7bfcd86c4e9a0d70645bdd6fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_0e047e464bd7cb998b71a1dd21f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(`DROP TABLE "records"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
