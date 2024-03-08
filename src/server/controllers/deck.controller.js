import deckModel from "../models/deck.model.js";

export const allDecks = async (req, res) => {
  const { userId } = req.params;

  try {
    const decks = await deckModel.getAll(userId);
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve deck data", error });
  }
};

export const singleDeck = async (req, res) => {
  const { deckId } = req.params;

  try {
    const deckInfo = await deckModel.getOne(deckId);
    delete deckInfo.user_id;

    const cardColumns = ["card.id", "name", "description"];
    if (deckInfo.is_custom) cardColumns.push("occurences");
    if (deckInfo.is_scored) cardColumns.push("penalty");

    const cards = await deckModel.getCards(deckId, cardColumns);

    const deck = { ...deckInfo, cards };
    res.json(deck);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to retrieve deck with ID ${deckId}.`, error });
  }
};

export const newDeck = async (req, res) => {
  const { userId } = req.params;
  const newDeck = { ...req.body, user_id: userId };

  try {
    const createdDeck = await deckModel.addNew(newDeck);
    res.status(201).json(createdDeck);
  } catch (error) {
    res.status(500).json({ message: "Unable to create new deck.", error });
  }
};

export const cardsToDeck = async (req, res) => {
  const { deckId } = req.params;
  const cards = req.body;

  try {
    const deckToUpdate = await deckModel.getOne(deckId);

    const cardColumns = ["id", "card_id", "deck_id"];
    if (deckToUpdate.is_custom) cardColumns.push("occurences");
    if (deckToUpdate.is_scored) cardColumns.push("penalty");

    const createdDeckCards = await Promise.all(
      cards.map(async (card) => {
        const createdDeckCard = await deckModel.addCard(
          deckId,
          card,
          cardColumns
        );
        return createdDeckCard;
      })
    );

    const updatedDeckCards = await deckModel.getCards(deckId);
    if (deckToUpdate.is_custom && updatedDeckCards.length > 0) {
      await deckModel.setAsPlayable(deckId);
    }
    if (!deckToUpdate.is_custom && updatedDeckCards.length === 13) {
      await deckModel.setAsPlayable(deckId);
    }

    res.status(201).json(createdDeckCards);
  } catch (error) {
    res.status(500).json({ message: "Unable to add cards to deck.", error });
  }
};
