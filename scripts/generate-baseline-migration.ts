import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import dataSource from "../src/database/data-source";

const CLASS_NAME = "InitialSchema";

const escapeForTemplate = (sql: string): string =>
  sql.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const main = async (): Promise<void> => {
  const timestamp = Number(process.argv[2] ?? Date.now());
  const source = await dataSource.initialize();

  try {
    const [{ schema }]: { schema: string | null }[] = await source.query(
      "SELECT DATABASE() AS `schema`",
    );
    const tables: { name: string }[] = await source.query(
      `SELECT TABLE_NAME AS name
         FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME`,
      [schema],
    );

    const creates: { table: string; sql: string }[] = [];
    for (const { name } of tables) {
      if (name === "migrations") continue;
      const [row]: Record<string, string>[] = await source.query(
        `SHOW CREATE TABLE \`${name}\``,
      );
      creates.push({
        table: name,
        sql: row["Create Table"].replace(/ AUTO_INCREMENT=\d+/g, ""),
      });
    }

    const ups = creates
      .map(
        ({ sql }) =>
          `    await queryRunner.query(\`${escapeForTemplate(sql)}\`);`,
      )
      .join("\n\n");

    const downs = [...creates]
      .reverse()
      .map(
        ({ table }) =>
          `    await queryRunner.query(\`DROP TABLE IF EXISTS \\\`${table}\\\`\`);`,
      )
      .join("\n");

    const body = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${CLASS_NAME}${timestamp} implements MigrationInterface {
  name = "${CLASS_NAME}${timestamp}";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`SET FOREIGN_KEY_CHECKS = 0\`);

${ups}

    await queryRunner.query(\`SET FOREIGN_KEY_CHECKS = 1\`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`SET FOREIGN_KEY_CHECKS = 0\`);
${downs}
    await queryRunner.query(\`SET FOREIGN_KEY_CHECKS = 1\`);
  }
}
`;

    const target = resolve(
      "src/database/migrations",
      `${timestamp}-${CLASS_NAME}.ts`,
    );
    mkdirSync(resolve("src/database/migrations"), { recursive: true });
    writeFileSync(target, body);
    console.log(
      `Baseline from "${schema}" with ${creates.length} tables -> ${target}`,
    );
  } finally {
    await source.destroy();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
