import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { DataSource } from "typeorm";
import dataSource from "../src/database/data-source";

interface ColumnSnapshot {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  extra: string;
  comment: string;
  position: number;
}

interface IndexSnapshot {
  name: string;
  unique: boolean;
  columns: string[];
}

interface ForeignKeySnapshot {
  name: string;
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
  onUpdate: string;
  onDelete: string;
}

interface TableSnapshot {
  name: string;
  engine: string;
  collation: string;
  rows: number;
  columns: ColumnSnapshot[];
  indexes: IndexSnapshot[];
  foreignKeys: ForeignKeySnapshot[];
}

interface TableRow {
  name: string;
  engine: string;
  collation: string;
  rows: number | null;
}

interface ColumnRow {
  tableName: string;
  name: string;
  type: string;
  nullable: string;
  default: string | null;
  extra: string;
  comment: string;
  position: number;
}

interface IndexRow {
  tableName: string;
  name: string;
  nonUnique: number;
  seq: number;
  columnName: string;
}

interface ForeignKeyRow {
  tableName: string;
  name: string;
  columnName: string;
  seq: number;
  referencedTable: string;
  referencedColumn: string;
  onUpdate: string;
  onDelete: string;
}

const readTables = async (
  source: DataSource,
  schema: string,
): Promise<TableSnapshot[]> => {
  const tables: TableRow[] = await source.query(
    `SELECT TABLE_NAME AS name, ENGINE AS engine, TABLE_COLLATION AS collation, TABLE_ROWS AS \`rows\`
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME`,
    [schema],
  );

  const columns: ColumnRow[] = await source.query(
    `SELECT TABLE_NAME AS tableName, COLUMN_NAME AS name, COLUMN_TYPE AS type,
            IS_NULLABLE AS nullable, COLUMN_DEFAULT AS \`default\`, EXTRA AS extra,
            COLUMN_COMMENT AS comment, ORDINAL_POSITION AS position
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME, ORDINAL_POSITION`,
    [schema],
  );

  const indexes: IndexRow[] = await source.query(
    `SELECT TABLE_NAME AS tableName, INDEX_NAME AS name, NON_UNIQUE AS nonUnique,
            SEQ_IN_INDEX AS seq, COLUMN_NAME AS columnName
       FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`,
    [schema],
  );

  const foreignKeys: ForeignKeyRow[] = await source.query(
    `SELECT k.TABLE_NAME AS tableName, k.CONSTRAINT_NAME AS name, k.COLUMN_NAME AS columnName,
            k.ORDINAL_POSITION AS seq, k.REFERENCED_TABLE_NAME AS referencedTable,
            k.REFERENCED_COLUMN_NAME AS referencedColumn,
            r.UPDATE_RULE AS onUpdate, r.DELETE_RULE AS onDelete
       FROM information_schema.KEY_COLUMN_USAGE k
       JOIN information_schema.REFERENTIAL_CONSTRAINTS r
         ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA
        AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
      WHERE k.TABLE_SCHEMA = ? AND k.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY k.TABLE_NAME, k.CONSTRAINT_NAME, k.ORDINAL_POSITION`,
    [schema],
  );

  return tables.map((table): TableSnapshot => {
    const indexRows = indexes.filter((row) => row.tableName === table.name);
    const indexNames = [...new Set(indexRows.map((row) => row.name))];
    const fkRows = foreignKeys.filter((row) => row.tableName === table.name);
    const fkNames = [...new Set(fkRows.map((row) => row.name))];

    return {
      name: table.name,
      engine: table.engine,
      collation: table.collation,
      rows: Number(table.rows ?? 0),
      columns: columns
        .filter((row) => row.tableName === table.name)
        .map((row) => ({
          name: row.name,
          type: row.type,
          nullable: row.nullable === "YES",
          default: row.default,
          extra: row.extra,
          comment: row.comment,
          position: Number(row.position),
        })),
      indexes: indexNames.map((name) => {
        const rows = indexRows.filter((row) => row.name === name);
        return {
          name,
          unique: Number(rows[0].nonUnique) === 0,
          columns: rows.map((row) => row.columnName),
        };
      }),
      foreignKeys: fkNames.map((name) => {
        const rows = fkRows.filter((row) => row.name === name);
        return {
          name,
          columns: rows.map((row) => row.columnName),
          referencedTable: rows[0].referencedTable,
          referencedColumns: rows.map((row) => row.referencedColumn),
          onUpdate: rows[0].onUpdate,
          onDelete: rows[0].onDelete,
        };
      }),
    };
  });
};

const main = async (): Promise<void> => {
  const target = resolve(process.argv[2] ?? "db/snapshots/current.json");
  const source = await dataSource.initialize();

  try {
    const [{ schema }]: { schema: string | null }[] = await source.query(
      "SELECT DATABASE() AS `schema`",
    );
    if (!schema) {
      throw new Error("The connection has no database selected.");
    }

    const snapshot = {
      generatedAt: new Date().toISOString(),
      schema,
      tables: await readTables(source, schema),
    };

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(snapshot, null, 2)}\n`);

    const columnCount = snapshot.tables.reduce(
      (total, table) => total + table.columns.length,
      0,
    );
    console.log(
      `Snapshot of "${schema}": ${snapshot.tables.length} tables, ${columnCount} columns -> ${target}`,
    );
  } finally {
    await source.destroy();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
