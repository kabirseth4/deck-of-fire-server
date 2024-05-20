import { Request, Response } from "express";
import { deckModel } from "../models/index.js";
import { DeckWithCards, NewDeck, NewDeckCard } from "../types/deck.js";

export const allDecks = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const decks = await deckModel.getAll(userId);
    return res.json(decks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to retrieve deck data", error });
  }
};

export const singleDeck = async (req: Request, res: Response) => {
  const { deckId } = req.params;

  try {
    const deck = await deckModel.getOne(deckId);
    if (!deck) throw new Error("Unable to retrieve deck from database");
    delete deck.user_id;

    const cardColumns = ["card.id", "name", "description"];
    if (deck.is_custom) cardColumns.push("occurences");
    if (deck.is_scored) cardColumns.push("penalty");

    const cards = await deckModel.getCards(deckId, cardColumns);

    const deckWithCards: DeckWithCards = { ...deck, cards };
    return res.json(deckWithCards);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to retrieve deck with ID ${deckId}.`, error });
  }
};

export const newDeck = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newDeck: NewDeck = { ...req.body, user_id: userId };

  try {
    const createdDeck = await deckModel.addNew(newDeck);
    return res.status(201).json(createdDeck);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create new deck.", error });
  }
};

export const cardsToDeck = async (req: Request, res: Response) => {
  const { deckId } = req.params;
  const cards: NewDeckCard[] = req.body;

  try {
    const deckToUpdate = await deckModel.getOne(deckId);
    if (!deckToUpdate) throw new Error("Unable to retrieve deck from database");

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

    return res.status(201).json(createdDeckCards);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to add cards to deck.", error });
  }
};
