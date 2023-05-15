import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntitiesTable1684157955466 implements MigrationInterface {
  name = 'CreateEntitiesTable1684157955466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "securityToken" character varying(16), "securityTokenRequestedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9099c98f00a1b5aca6b8f7f04a3" UNIQUE ("publicId"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "users"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "users"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "users"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TABLE "boards" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "UQ_3d16c05a00eecea1cfd33340897" UNIQUE ("publicId"), CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id")); COMMENT ON COLUMN "boards"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "boards"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "boards"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "boards"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TABLE "columns" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "boardId" integer, CONSTRAINT "UQ_95703a28e3a53b6f4c7e0d9b8ba" UNIQUE ("publicId"), CONSTRAINT "PK_4ac339ccbbfed1dcd96812abbd5" PRIMARY KEY ("id")); COMMENT ON COLUMN "columns"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "columns"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "columns"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "columns"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "columnId" integer, CONSTRAINT "UQ_98d96aec4623970e0d148f257df" UNIQUE ("publicId"), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")); COMMENT ON COLUMN "tasks"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "tasks"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "tasks"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "tasks"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TABLE "subtasks" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "taskId" integer, CONSTRAINT "UQ_3d356bf7e29ade747d499166f29" UNIQUE ("publicId"), CONSTRAINT "PK_035c1c153f0239ecc95be448d96" PRIMARY KEY ("id")); COMMENT ON COLUMN "subtasks"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "subtasks"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "subtasks"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "subtasks"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `ALTER TABLE "boards" ADD CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "columns" ADD CONSTRAINT "FK_ac92bfd7ba33174aabef610f361" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtasks" ADD CONSTRAINT "FK_bde15cf8f7b07bb4ccad8ef6fa3" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subtasks" DROP CONSTRAINT "FK_bde15cf8f7b07bb4ccad8ef6fa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "columns" DROP CONSTRAINT "FK_ac92bfd7ba33174aabef610f361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "boards" DROP CONSTRAINT "FK_1ce74d5411749b559748b9f3276"`,
    );
    await queryRunner.query(`DROP TABLE "subtasks"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "columns"`);
    await queryRunner.query(`DROP TABLE "boards"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
