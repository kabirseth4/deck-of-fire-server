require("dotenv").config();

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_USER: user,
  DB_PASSWORD: password,
} = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
    host,
    database,
    user,
    password,
    charset: "utf8",
  },
};
