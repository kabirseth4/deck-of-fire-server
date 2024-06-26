import knex from "../configs/knex.config.js";
import { NewDeck, Deck, DeckCard, NewDeckCard, DBDeck } from "../types/deck.js";
import { Card } from "../types/card.js";
import { Id } from "../types/types.js";

const getAll = async (userId: Id) => {
  const dBDecks: DBDeck[] = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom", "is_playable");

  const decks: Deck[] = dBDecks.map(
    ({ id, name, is_scored, is_custom, is_playable }) => ({
      id,
      name,
      is_scored: !!is_scored,
      is_custom: !!is_custom,
      is_playable: !!is_playable,
    })
  );
  return decks;
};

const getOne = async (deckId: Id) => {
  const dBDeck: DBDeck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable", "user_id")
    .where({ id: deckId })
    .first();

  if (!dBDeck) return undefined;

  const deck: Deck = {
    id: dBDeck.id,
    name: dBDeck.name,
    is_scored: !!dBDeck.is_scored,
    is_custom: !!dBDeck.is_custom,
    is_playable: !!dBDeck.is_playable,
    user_id: dBDeck.user_id,
  };

  return deck;
};

const getCards = async (deckId: Id, columns: string[] | string = "*") => {
  const cards: Card[] = await knex("card")
    .join("deck_card", "deck_card.card_id", "card.id")
    .where({ deck_id: deckId })
    .select(columns);
  return cards;
};

const addNew = async (newDeck: NewDeck) => {
  const [newDeckId]: number[] = await knex("deck").insert(newDeck);
  const createdDeck = await getOne(newDeckId);
  if (!createdDeck) throw new Error("Unable to retrieve deck from database");
  delete createdDeck?.user_id;
  return createdDeck;
};

const addCard = async (
  deckId: Id,
  deckCard: NewDeckCard,
  cardColumns: string[] | string = "*"
) => {
  deckCard.deck_id = deckId;
  const newDeckCardId: number[] = await knex("deck_card").insert(deckCard);

  const createdDeckCard: DeckCard = await knex("deck_card")
    .whereIn("id", newDeckCardId)
    .first()
    .select(cardColumns);
  return createdDeckCard;
};

const setAsPlayable = async (deckId: Id) => {
  await knex("deck").update({ is_playable: true }).where({ id: deckId });
};

export const deckModel = {
  getAll,
  getOne,
  getCards,
  addNew,
  addCard,
  setAsPlayable,
};
