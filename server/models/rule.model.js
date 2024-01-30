const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const rules = await knex("rule")
    .where({ user_id: userId })
    .select("id", "name", "description");
  return rules;
};

const addNew = async (newRule) => {
  const newRuleIds = await knex("rule").insert(newRule);
  const createdRule = await knex("rule")
    .where({ id: newRuleIds[0] })
    .first()
    .select("id", "name", "description");
  return createdRule;
};

module.exports = { getAll, addNew };
