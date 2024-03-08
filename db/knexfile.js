import { join } from "path";
import { config } from "dotenv";

const __dirname = import.meta.dirname;
config({ path: join(__dirname, "../.env") });

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_USER: user,
  DB_PASSWORD: password,
  TEST_DB_NAME: testDatabase,
} = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
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
  },
  test: {
    client: "mysql2",
    connection: {
      host,
      database: testDatabase,
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
  },
};
