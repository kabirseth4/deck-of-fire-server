require("dotenv").config();

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
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host,
      database,
      user,
      password,
      charset: "utf8",
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
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
