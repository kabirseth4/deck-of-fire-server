const knex = require("knex")(require("../../db/knexfile"));

const getOne = async (userId) => {
  const user = await knex("user").where({ id: userId }).first();
  return user;
};

module.exports = { getOne };
