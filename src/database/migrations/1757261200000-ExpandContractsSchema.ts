import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandContractsSchema1757261200000 implements MigrationInterface {
  name = "ExpandContractsSchema1757261200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`tennat_phone\` \`tenant_phone\` varchar(30) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`tenant_name\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`lessor_name\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`lessor_phone\` varchar(30) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_lastname\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_document_type\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_document\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`tenant_legal_representative\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_lastname\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_document\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_document_type\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`lessor_legal_representative\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`cosigner_name\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`cosigner_document\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`cosigner_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`cosigner_email\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`cosigner_phone\` varchar(30) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`duration\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`canon\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`start_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`end_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`place_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`place_municipio\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`registration_number\` varchar(100) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_8362c9fc60db89ab7ee3b6b28fd\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8362c9fc60db89ab7ee3b6b28f\` ON \`contracts\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_contracts_ct_id\` ON \`contracts\` (\`ct_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_8362c9fc60db89ab7ee3b6b28fd\` FOREIGN KEY (\`ct_id\`) REFERENCES \`contracts_templates\`(\`ct_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_8362c9fc60db89ab7ee3b6b28fd\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_contracts_ct_id\` ON \`contracts\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_8362c9fc60db89ab7ee3b6b28f\` ON \`contracts\` (\`ct_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_8362c9fc60db89ab7ee3b6b28fd\` FOREIGN KEY (\`ct_id\`) REFERENCES \`contracts_templates\`(\`ct_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`registration_number\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`place_municipio\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`place_address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`end_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`start_date\``,
    );
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`canon\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`duration\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`cosigner_phone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`cosigner_email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`cosigner_address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`cosigner_document\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`cosigner_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_legal_representative\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_document_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_document\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`lessor_lastname\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_legal_representative\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_document\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_document_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP COLUMN \`tenant_lastname\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`lessor_phone\` varchar(15) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`lessor_name\` varchar(30) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` MODIFY \`tenant_name\` varchar(30) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`tenant_phone\` \`tennat_phone\` varchar(15) NULL`,
    );
  }
}
