const deckModel = require("../models/deck.model");

const allDecks = async (req, res) => {
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
    delete deckInfo.user_id;

    const ruleColumns = ["rule.id", "name", "description"];
    if (deckInfo.is_custom) ruleColumns.push("occurences");
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

const newDeck = async (req, res) => {
  const { userId } = req.params;
  const newDeck = { ...req.body, user_id: userId };

  try {
    const createdDeck = await deckModel.addNew(newDeck);
    res.status(201).json(createdDeck);
  } catch (error) {
    res.status(500).json({ message: "Unable to create new deck.", error });
  }
};

const rulesToDeck = async (req, res) => {
  const { deckId } = req.params;
  const rules = req.body;

  try {
    const createdDeckRules = await Promise.all(
      rules.map(async (rule) => {
        const createdDeckRule = await deckModel.addRule(deckId, rule);
        return createdDeckRule;
      })
    );

    res.json(createdDeckRules);
  } catch (error) {
    res.status(500).json({ message: "Unable to add rules to deck.", error });
  }
};

module.exports = { allDecks, singleDeck, newDeck, rulesToDeck };
