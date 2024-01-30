const knex = require("knex")(require("../../db/knexfile"));

const index = async (req, res) => {
  const { authorization: userId } = req.headers;

  try {
    const decks = await knex("deck")
      .where({ user_id: userId })
      .select("id", "name", "is_scored", "is_standard");
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve deck data", error });
  }
};

const singleDeck = async (req, res) => {
  const userId = Number(req.headers.authorization);
  const { deckId } = req.params;

  try {
    const deck = await knex("deck")
      .select("id", "name", "is_scored", "is_standard", "user_id")
      .where({ id: deckId })
      .first();

    if (deck.user_id !== userId) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    delete deck.user_id;

    const ruleColumns = ["rule.id", "name", "description"];

    if (!deck.is_standard) ruleColumns.push("occurences");
    if (deck.is_scored) ruleColumns.push("penalty");

    const rules = await knex("rule")
      .join("deck_rule", "deck_rule.rule_id", "rule.id")
      .where({ deck_id: deckId })
      .select(ruleColumns);

    const deckWithRules = { ...deck, rules };
    res.json(deckWithRules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to retrieve deck with ID " + id, error });
  }
};

module.exports = { index, singleDeck };
