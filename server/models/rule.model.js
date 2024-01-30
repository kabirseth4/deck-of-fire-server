const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const rules = await knex("rule")
    .where({ user_id: userId })
    .select("id", "name", "description");
  return rules;
};

const getOne = async (ruleId) => {
  const rule = await knex("rule")
    .select("id", "name", "description", "user_id")
    .where({ id: ruleId })
    .first();
  return rule;
};

const addNew = async (newRule) => {
  const newRuleId = await knex("rule").insert(newRule);
  const createdRule = await getOne(newRuleId[0]);
  delete createdRule.user_id;
  return createdRule;
};

module.exports = { getAll, getOne, addNew };
