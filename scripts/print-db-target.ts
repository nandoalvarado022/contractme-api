import {
  buildDataSourceOptions,
  resolveEnvPrefix,
} from "../src/database/data-source";

const options = buildDataSourceOptions() as {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
};

const prefix = resolveEnvPrefix(process.env.NODE_ENV);
const target = `${options.host}:${options.port}/${options.database}`;
const banner = prefix === "REMOTE" ? "  >>> PRODUCCION <<<" : "";

console.log("");
console.log(`  NODE_ENV : ${process.env.NODE_ENV ?? "(sin definir)"}`);
console.log(`  Conexion : DB_${prefix}_*${banner}`);
console.log(`  Destino  : ${target}`);
console.log(`  Usuario  : ${options.username}`);
console.log("");
