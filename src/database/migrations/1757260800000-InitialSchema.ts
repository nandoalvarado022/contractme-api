import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1757260800000 implements MigrationInterface {
  name = "InitialSchema1757260800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);

    await queryRunner.query(`CREATE TABLE \`audit_logs\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`uid\` int DEFAULT NULL,
  \`uid_compromised\` int DEFAULT NULL,
  \`description\` varchar(255) NOT NULL,
  \`table\` varchar(255) NOT NULL,
  \`data\` varchar(255) NOT NULL,
  \`created_at\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_8b1acdf57041546450997efe108\` (\`uid\`),
  KEY \`FK_a4564910d5d86d8b6c8d32d1190\` (\`uid_compromised\`),
  CONSTRAINT \`FK_8b1acdf57041546450997efe108\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`),
  CONSTRAINT \`FK_a4564910d5d86d8b6c8d32d1190\` FOREIGN KEY (\`uid_compromised\`) REFERENCES \`users\` (\`uid\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`balance\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`last_transaction_id\` int DEFAULT NULL,
  \`uid\` int NOT NULL,
  \`amount\` int NOT NULL DEFAULT '0',
  \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`deletedAt\` datetime(6) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`REL_1289fec0db3cebff496c6bccc1\` (\`uid\`),
  UNIQUE KEY \`REL_8389f1e87ab9de3a3f69f759fb\` (\`last_transaction_id\`),
  CONSTRAINT \`FK_1289fec0db3cebff496c6bccc16\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`),
  CONSTRAINT \`FK_8389f1e87ab9de3a3f69f759fb9\` FOREIGN KEY (\`last_transaction_id\`) REFERENCES \`transactions\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`contracts\` (
  \`cid\` int NOT NULL AUTO_INCREMENT,
  \`tenant_name\` varchar(30) DEFAULT NULL,
  \`tenant_email\` varchar(100) DEFAULT NULL,
  \`tennat_phone\` varchar(15) DEFAULT NULL,
  \`lessor_name\` varchar(30) DEFAULT NULL,
  \`lessor_email\` varchar(100) DEFAULT NULL,
  \`lessor_phone\` varchar(15) DEFAULT NULL,
  \`hasSignature\` tinyint(1) DEFAULT NULL,
  \`ct_id\` int DEFAULT NULL,
  \`url\` text,
  \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (\`cid\`),
  UNIQUE KEY \`REL_8362c9fc60db89ab7ee3b6b28f\` (\`ct_id\`),
  CONSTRAINT \`FK_8362c9fc60db89ab7ee3b6b28fd\` FOREIGN KEY (\`ct_id\`) REFERENCES \`contracts_templates\` (\`ct_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`contracts_templates\` (
  \`ct_id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`description\` varchar(255) NOT NULL,
  \`category\` varchar(255) NOT NULL,
  \`type\` varchar(255) NOT NULL,
  \`status\` enum('active','inactive') NOT NULL DEFAULT 'active',
  \`url\` varchar(255) NOT NULL,
  \`created_at\` varchar(255) NOT NULL,
  PRIMARY KEY (\`ct_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`contracts_templates_fields\` (
  \`ctf_id\` int NOT NULL AUTO_INCREMENT,
  \`ct_id\` int NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`label\` varchar(255) NOT NULL,
  \`placeholder\` varchar(255) NOT NULL,
  \`type\` varchar(255) NOT NULL,
  \`page\` int DEFAULT NULL,
  \`order\` float NOT NULL,
  \`x\` int DEFAULT NULL,
  \`y\` int DEFAULT NULL,
  PRIMARY KEY (\`ctf_id\`),
  KEY \`FK_c17ef44a9c1693976e448ce163f\` (\`ct_id\`),
  CONSTRAINT \`FK_c17ef44a9c1693976e448ce163f\` FOREIGN KEY (\`ct_id\`) REFERENCES \`contracts_templates\` (\`ct_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`documents\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`document\` varchar(45) DEFAULT NULL,
  \`type\` varchar(45) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`education\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`place\` varchar(100) NOT NULL,
  \`title\` varchar(100) NOT NULL,
  \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  \`deleted_at\` datetime(6) DEFAULT NULL,
  \`uid\` int DEFAULT NULL,
  \`start_date\` datetime NOT NULL,
  \`end_date\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_e616b0297c4ef18322f4b7dd9fa\` (\`uid\`),
  CONSTRAINT \`FK_e616b0297c4ef18322f4b7dd9fa\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`experience\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`company\` varchar(100) NOT NULL,
  \`position\` varchar(100) NOT NULL,
  \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  \`deleted_at\` datetime(6) DEFAULT NULL,
  \`uid\` int DEFAULT NULL,
  \`start_date\` datetime NOT NULL,
  \`end_date\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_4c0c83abae99aeafc1a3df0f966\` (\`uid\`),
  CONSTRAINT \`FK_4c0c83abae99aeafc1a3df0f966\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`global_variables\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`key\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`value\` float NOT NULL,
  \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`key\` (\`key\`),
  KEY \`idx_key\` (\`key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    await queryRunner.query(`CREATE TABLE \`leads\` (
  \`lid\` int NOT NULL AUTO_INCREMENT,
  \`full_name\` varchar(100) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`phone\` varchar(20) DEFAULT NULL,
  \`type_contact\` enum('information','pricing','real-state','support','other') NOT NULL,
  \`message\` text NOT NULL,
  PRIMARY KEY (\`lid\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`properties\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`owner_uid\` int NOT NULL,
  \`city\` varchar(255) NOT NULL,
  \`address\` varchar(255) NOT NULL,
  \`image\` varchar(255) NOT NULL,
  \`price\` int DEFAULT NULL,
  \`type\` varchar(255) NOT NULL,
  \`bedrooms\` int NOT NULL,
  \`bathrooms\` int NOT NULL,
  \`area\` decimal(10,2) NOT NULL,
  \`description\` text NOT NULL,
  \`registration_number\` varchar(100) DEFAULT NULL,
  \`tenant_id\` int DEFAULT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`deleted_at\` datetime(6) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_6bcd5c3d46689610c9bbf14e0eb\` (\`tenant_id\`),
  KEY \`FK_9ff815bcb722486897629c74ef2\` (\`owner_uid\`),
  CONSTRAINT \`FK_6bcd5c3d46689610c9bbf14e0eb\` FOREIGN KEY (\`tenant_id\`) REFERENCES \`users\` (\`uid\`),
  CONSTRAINT \`FK_9ff815bcb722486897629c74ef2\` FOREIGN KEY (\`owner_uid\`) REFERENCES \`users\` (\`uid\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`property_interested\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`phone\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`property_id\` int NOT NULL,
  \`user_id\` int DEFAULT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`FK_ae34b61cd07176db98d3a16cc01\` (\`property_id\`),
  KEY \`FK_93fde83a12bccf2b1d2646139c7\` (\`user_id\`),
  CONSTRAINT \`FK_93fde83a12bccf2b1d2646139c7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`uid\`),
  CONSTRAINT \`FK_ae34b61cd07176db98d3a16cc01\` FOREIGN KEY (\`property_id\`) REFERENCES \`properties\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`property_notes\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`text\` text NOT NULL,
  \`property_id\` int NOT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`FK_1aca189349feec8837033322857\` (\`property_id\`),
  CONSTRAINT \`FK_1aca189349feec8837033322857\` FOREIGN KEY (\`property_id\`) REFERENCES \`properties\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`reference\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`phone\` varchar(15) DEFAULT NULL,
  \`relationship\` varchar(100) NOT NULL,
  \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  \`deleted_at\` datetime(6) DEFAULT NULL,
  \`uid\` int DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_5073bfa69d63953da9c1d31b599\` (\`uid\`),
  CONSTRAINT \`FK_5073bfa69d63953da9c1d31b599\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`roles\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`rid\` int DEFAULT NULL COMMENT '1: admin, 2: standard, 3: visitor',
  \`uid\` int DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`transactions\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`concept\` varchar(255) NOT NULL,
  \`status\` enum('pending','blocked','rejected','completed','failed') NOT NULL DEFAULT 'completed',
  \`type\` enum('add','remove') NOT NULL,
  \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`uid\` int NOT NULL,
  \`amount\` int NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`FK_c3dcba0b0a4c2ed3442124475bf\` (\`uid\`),
  CONSTRAINT \`FK_c3dcba0b0a4c2ed3442124475bf\` FOREIGN KEY (\`uid\`) REFERENCES \`users\` (\`uid\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`CREATE TABLE \`users\` (
  \`uid\` int NOT NULL AUTO_INCREMENT,
  \`created_by\` int DEFAULT NULL,
  \`document_type\` enum('CC','NIT','TI','CE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`document_number\` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`name\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`last_name\` varchar(50) DEFAULT NULL,
  \`phone\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`email\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`password\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`picture\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`birth_date\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  \`role\` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'user',
  \`created_at\` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  \`deleted_at\` datetime(6) DEFAULT NULL,
  PRIMARY KEY (\`uid\`),
  UNIQUE KEY \`users_unique_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`);

    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`transactions\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`roles\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`reference\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`property_notes\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`property_interested\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`properties\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`leads\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`global_variables\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`experience\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`education\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`documents\``);
    await queryRunner.query(
      `DROP TABLE IF EXISTS \`contracts_templates_fields\``,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS \`contracts_templates\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`contracts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`balance\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`audit_logs\``);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }
}
