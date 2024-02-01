const deckRuleData = require("../seed-data/deck_rule.data");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("deck_rule").del();
  await knex("deck_rule").insert(deckRuleData);
};
