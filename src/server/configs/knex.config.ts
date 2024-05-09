import knex from "knex";
import knexConfig from "../../db/knexfile";

const environment = process.env.NODE_ENV || "development";

export default knex(knexConfig[environment]);
