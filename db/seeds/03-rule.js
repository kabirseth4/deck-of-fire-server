const ruleData = require("../seed-data/rule-data");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("rule").del();
  await knex("rule").insert(ruleData);
};
