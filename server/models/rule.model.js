const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const rules = await knex("rule")
    .where({ user_id: userId })
    .select("id", "name", "description");
  return rules;
};

module.exports = { getAll };
