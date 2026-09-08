import { MigrationInterface, QueryRunner } from "typeorm";

export class RequireUserEmail1757261100000 implements MigrationInterface {
  name = "RequireUserEmail1757261100000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE \`users\` SET \`email\` = CONCAT('placeholder-', \`uid\`, '@contractme.invalid') WHERE \`email\` IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`email\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `UPDATE \`users\` SET \`email\` = NULL WHERE \`email\` = CONCAT('placeholder-', \`uid\`, '@contractme.invalid')`,
    );
  }
}
