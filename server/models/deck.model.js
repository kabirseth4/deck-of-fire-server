const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const decks = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_standard");
  return decks;
};

const getOne = async (deckId) => {
  const deck = await knex("deck")
    .select("id", "name", "is_scored", "is_standard")
    .where({ id: deckId })
    .first();
  return deck;
};

const getRules = async (deckId, columns) => {
  const rules = await knex("rule")
    .join("deck_rule", "deck_rule.rule_id", "rule.id")
    .where({ deck_id: deckId })
    .select(columns);
  return rules;
};

module.exports = { getAll, getOne, getRules };
