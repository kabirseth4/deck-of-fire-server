const deckModel = require("../models/deck.model");

const index = async (req, res) => {
  const { userId } = req.params;

  try {
    const decks = await deckModel.getAll(userId);
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve deck data", error });
  }
};

const singleDeck = async (req, res) => {
  const { deckId } = req.params;

  try {
    const deckInfo = await deckModel.getOne(deckId);

    const ruleColumns = ["rule.id", "name", "description"];

    if (!deckInfo.is_standard) ruleColumns.push("occurences");
    if (deckInfo.is_scored) ruleColumns.push("penalty");

    const rules = await deckModel.getRules(deckId, ruleColumns);

    const deck = { ...deckInfo, rules };
    res.json(deck);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to retrieve deck with ID ${deckId}.`, error });
  }
};

module.exports = { index, singleDeck };
