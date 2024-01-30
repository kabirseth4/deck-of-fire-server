const deckModel = require("../models/deck.model");

const index = async (req, res) => {
  const { authorization: userId } = req.headers;

  try {
    const decks = await deckModel.getAll(userId);
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve deck data", error });
  }
};

const singleDeck = async (req, res) => {
  const userId = Number(req.headers.authorization);
  const { deckId } = req.params;

  try {
    const deck = await deckModel.getOne(deckId);

    if (deck.user_id !== userId) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    delete deck.user_id;

    const ruleColumns = ["rule.id", "name", "description"];

    if (!deck.is_standard) ruleColumns.push("occurences");
    if (deck.is_scored) ruleColumns.push("penalty");

    const rules = await deckModel.getRules(deckId, ruleColumns);

    const deckWithRules = { ...deck, rules };
    res.json(deckWithRules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to retrieve deck with ID " + deckId, error });
  }
};

module.exports = { index, singleDeck };
