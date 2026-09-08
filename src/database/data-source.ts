import { join } from "path";
import { config as loadEnvFile } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

loadEnvFile();

export type EnvReader = (key: string) => string | undefined;

const readFromProcessEnv: EnvReader = (key) => process.env[key];

export const resolveEnvPrefix = (nodeEnv?: string): "REMOTE" | "LOCAL" =>
  nodeEnv === "production" ? "REMOTE" : "LOCAL";

export const buildDataSourceOptions = (
  read: EnvReader = readFromProcessEnv,
): DataSourceOptions => {
  const prefix = `DB_${resolveEnvPrefix(read("NODE_ENV"))}`;
  const port = read(`${prefix}_PORT`);

  return {
    type: (read("DB_TYPE") ?? "mysql") as "mysql",
    host: read(`${prefix}_HOST`),
    port: port ? Number(port) : 3306,
    username: read(`${prefix}_USERNAME`),
    password: read(`${prefix}_PASSWORD`),
    database: read(`${prefix}_DATABASE`),
    entities: [join(__dirname, "..", "**", "*.entity{.ts,.js}")],
    migrations: [join(__dirname, "migrations", "*{.ts,.js}")],
    migrationsTableName: "migrations",
    synchronize: false,
    migrationsRun: read("DB_MIGRATIONS_RUN") === "true",
    logging: false,
  };
};

export default new DataSource(buildDataSourceOptions());
