const knex = require("../configs/knex.config");

const getAll = async (userId) => {
  const decks = await knex("deck")
    .where({ user_id: userId })
    .select("id", "name", "is_scored", "is_custom", "is_playable");
  return decks;
};

const getOne = async (deckId) => {
  const deck = await knex("deck")
    .select("id", "name", "is_scored", "is_custom", "is_playable", "user_id")
    .where({ id: deckId })
    .first();
  return deck;
};

const getCards = async (deckId, columns = "*") => {
  const cards = await knex("card")
    .join("deck_card", "deck_card.card_id", "card.id")
    .where({ deck_id: deckId })
    .select(columns);
  return cards;
};

const addNew = async (newDeck) => {
  const newDeckIds = await knex("deck").insert(newDeck);
  const createdDeck = await getOne(newDeckIds[0]);
  delete createdDeck.user_id;
  return createdDeck;
};

const addCard = async (deckId, card, cardColumns = "*") => {
  const deckCard = { ...card, deck_id: deckId };
  const newDeckCardId = await knex("deck_card").insert(deckCard);

  const createdDeckCard = await knex("deck_card")
    .whereIn("id", newDeckCardId)
    .first()
    .select(cardColumns);
  return createdDeckCard;
};

const setAsPlayable = async (deckId) => {
  await knex("deck").update({ is_playable: true }).where({ id: deckId });
};

module.exports = { getAll, getOne, getCards, addNew, addCard, setAsPlayable };
