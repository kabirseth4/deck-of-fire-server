const knex = require("knex")(require("../../db/knexfile"));

const getAll = async (userId) => {
  const decks = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom", "is_playable");
  return decks;
};

const getOne = async (deckId) => {
  const deck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable", "user_id")
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

const addRule = async (deckId, rule, ruleColumns) => {
  const deckRule = { ...rule, deck_id: deckId };
  const newDeckRuleId = await knex("deck_rule").insert(deckRule);

  const createdDeckRule = await knex("deck_rule")
    .whereIn("id", newDeckRuleId)
    .first()
    .select(ruleColumns);
  return createdDeckRule;
};

const setAsPlayable = async (deckId) => {
  await knex("deck").update({ is_playable: true }).where({ id: deckId });
};

module.exports = { getAll, getOne, getRules, addNew, addRule, setAsPlayable };
