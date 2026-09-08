import { MigrationInterface, QueryRunner } from "typeorm";

export class AlignSchemaWithEntities1757260900000
  implements MigrationInterface
{
  name = "AlignSchemaWithEntities1757260900000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`idx_key\` ON \`global_variables\``);

    await queryRunner.query(
      `ALTER TABLE \`global_variables\` MODIFY \`value\` text NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`properties\` MODIFY \`price\` decimal(15,2) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_uid\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_uid\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`hasSignature\` tinyint NULL DEFAULT 0`,
    );

    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`password\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`document_type\` enum ('CC', 'NIT', 'TI', 'CE') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`document_number\` varchar(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f32b1cb14a9920477bcfd63df2c\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`uid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f32b1cb14a9920477bcfd63df2c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`role\` enum ('user', 'admin') NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`document_number\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`document_type\` enum ('CC', 'NIT', 'TI', 'CE') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`password\` varchar(255) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`hasSignature\` tinyint(1) NULL DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_uid\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_uid\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`properties\` MODIFY \`price\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`global_variables\` MODIFY \`value\` float NOT NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX \`idx_key\` ON \`global_variables\` (\`key\`)`,
    );
  }
}
