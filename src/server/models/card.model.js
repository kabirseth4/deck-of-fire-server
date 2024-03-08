import knex from "../configs/knex.config.js";

const getAll = async (userId) => {
  const cards = await knex("card")
    .where({ user_id: userId })
    .select("id", "name", "description");
  return cards;
};

const getOne = async (cardId) => {
  const card = await knex("card")
    .select("id", "name", "description", "user_id")
    .where({ id: cardId })
    .first();
  return card;
};

const addNew = async (newCard) => {
  const newCardId = await knex("card").insert(newCard);
  const createdCard = await getOne(newCardId[0]);
  delete createdCard.user_id;
  return createdCard;
};

export default { getAll, getOne, addNew };
