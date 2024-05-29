import type {
  NewDeck,
  Deck,
  DeckCard,
  NewDeckCard,
  DBDeck,
  Card,
  Id,
} from "../types/index.js";
import knex from "../configs/knex.config.js";

export const readAll = async (userId: Id) => {
  const dBDecks: DBDeck[] = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable")
    .where({ user_id: userId });

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

export const readOne = async (deckId: Id) => {
  const dBDeck = await knex<DBDeck>("deck")
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

export const readCards = async (
  deckId: Id,
  columns: string[] | string = "*"
) => {
  const cards: Card[] = await knex("card")
    .join("deck_card", "deck_card.card_id", "card.id")
    .where({ deck_id: deckId })
    .select(columns);
  return cards;
};

export const create = async (newDeck: NewDeck) => {
  const [newDeckId] = await knex("deck").insert(newDeck);
  const createdDeck = await readOne(newDeckId);
  if (!createdDeck)
    throw new Error("Unable to retrieve new deck from database");
  delete createdDeck?.user_id;
  return createdDeck;
};

export const deleteOne = async (id: Id) => {
  const deletedRows = await knex("deck").where({ id }).del();
  if (!deletedRows) throw new Error("Unable to delete deck");
};

export const addCard = async (
  deckId: Id,
  deckCard: NewDeckCard,
  cardColumns: string[] | string = "*"
) => {
  deckCard.deck_id = deckId;
  const newDeckCardId = await knex<DeckCard>("deck_card").insert(deckCard);

  const createdDeckCard: DeckCard = await knex("deck_card")
    .select(cardColumns)
    .whereIn("id", newDeckCardId)
    .first();
  return createdDeckCard;
};

export const setAsPlayable = async (deckId: Id) => {
  await knex("deck").update({ is_playable: true }).where({ id: deckId });
};
