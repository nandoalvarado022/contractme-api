import { MigrationInterface, QueryRunner } from "typeorm";

export class DropLegacyTables1757261000000 implements MigrationInterface {
  name = "DropLegacyTables1757261000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`documents\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`documents\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`document\` varchar(45) DEFAULT NULL,
  \`type\` varchar(45) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`roles\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`rid\` int DEFAULT NULL COMMENT '1: admin, 2: standard, 3: visitor',
  \`uid\` int DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);
  }
}
