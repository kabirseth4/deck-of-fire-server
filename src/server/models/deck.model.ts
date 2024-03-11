import knex from "../configs/knex.config.js";
import { NewDeck, Deck, DeckCard, NewDeckCard } from "../types/deck.d.js";
import { Card } from "../types/card.d.js";

const getAll = async (userId: number) => {
  const decks: Deck[] = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom", "is_playable");
  return decks;
};

const getOne = async (deckId: number) => {
  const deck: Deck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable", "user_id")
    .where({ id: deckId })
    .first();
  return deck;
};

const getCards = async (deckId: number, columns: string[] | string = "*") => {
  const cards: Card[] = await knex("card")
    .join("deck_card", "deck_card.card_id", "card.id")
    .where({ deck_id: deckId })
    .select(columns);
  return cards;
};

const addNew = async (newDeck: NewDeck) => {
  const [newDeckId]: number[] = await knex("deck").insert(newDeck);
  const createdDeck: Deck = await getOne(newDeckId);
  delete createdDeck.user_id;
  return createdDeck;
};

const addCard = async (
  deckId: number,
  deckCard: NewDeckCard,
  cardColumns: string[] | string = "*"
) => {
  deckCard.deck_id = deckId;
  const newDeckCardId: number[] = await knex("deck_card").insert(deckCard);

  const createdDeckCard = await knex("deck_card")
    .whereIn("id", newDeckCardId)
    .first()
    .select(cardColumns);
  return createdDeckCard;
};

const setAsPlayable = async (deckId: number) => {
  await knex("deck").update({ is_playable: true }).where({ id: deckId });
};

export default { getAll, getOne, getCards, addNew, addCard, setAsPlayable };
