import knex from "../configs/knex.config";
import { NewDeck, Deck, DeckCard, NewDeckCard } from "../types/deck";
import { Card } from "../types/card";
import { Id } from "../types/types";

const getAll = async (userId: Id) => {
  const decks: Deck[] = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom", "is_playable");
  return decks;
};

const getOne = async (deckId: Id) => {
  const deck: Deck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable", "user_id")
    .where({ id: deckId })
    .first();
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
  delete createdDeck.user_id;
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

export default { getAll, getOne, getCards, addNew, addCard, setAsPlayable };
