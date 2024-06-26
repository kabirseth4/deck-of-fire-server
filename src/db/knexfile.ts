import type { Knex } from "knex";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_USER: user,
  DB_PASSWORD: password,
  TEST_DB_NAME: testDatabase,
} = process.env;

const defaults = {
  client: "mysql2",
  connection: {
    host,
    database,
    user,
    password,
    charset: "utf8",
  },
  migrations: {
    directory: join(__dirname, "/migrations"),
  },
  seeds: {
    directory: join(__dirname, "/seeds"),
  },
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...defaults,
  },
  test: {
    ...defaults,
    connection: {
      ...defaults.connection,
      database: testDatabase,
    },
  },
  production: {
    ...defaults,
  },
};

export default config;
