const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const decks = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom");
  return decks;
};

const getOne = async (deckId) => {
  const deck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "user_id")
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

const addNew = async (newDeck) => {
  const newDeckIds = await knex("deck").insert(newDeck);
  const createdDeck = await getOne(newDeckIds[0]);
  delete createdDeck.user_id;
  return createdDeck;
};

module.exports = { getAll, getOne, getRules, addNew };
