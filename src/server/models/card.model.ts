import knex from "../configs/knex.config";
import type { Card, NewCard } from "../types/card";
import { Id } from "../types/types";

const getAll = async (userId: Id) => {
  const cards: Card[] = await knex("card")
    .where({ user_id: userId })
    .select("id", "name", "description");
  return cards;
};

const getOne = async (cardId: Id) => {
  const card: Card = await knex("card")
    .select("id", "name", "description", "user_id")
    .where({ id: cardId })
    .first();
  return card;
};

const addNew = async (newCard: NewCard) => {
  const [newCardId] = await knex("card").insert(newCard);
  const createdCard: Card = await getOne(newCardId);
  delete createdCard.user_id;
  return createdCard;
};

export default { getAll, getOne, addNew };
