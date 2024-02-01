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

  const deckToUpdate = await deckModel.getOne(deckId);

  const ruleColumns = ["id", "rule_id", "deck_id"];
  if (deckToUpdate.is_custom) ruleColumns.push("occurences");
  if (deckToUpdate.is_scored) ruleColumns.push("penalty");

  try {
    const createdDeckRules = await Promise.all(
      rules.map(async (rule) => {
        const createdDeckRule = await deckModel.addRule(
          deckId,
          rule,
          ruleColumns
        );
        return createdDeckRule;
      })
    );

    const updatedDeckRules = await deckModel.getRules(deckId);
    if (deckToUpdate.is_custom && updatedDeckRules.length > 0) {
      await deckModel.setAsPlayable(deckId);
    }
    if (!deckToUpdate.is_custom && updatedDeckRules.length === 13) {
      await deckModel.setAsPlayable(deckId);
    }

    res.json(createdDeckRules);
  } catch (error) {
    res.status(500).json({ message: "Unable to add rules to deck.", error });
  }
};

module.exports = { allDecks, singleDeck, newDeck, rulesToDeck };
