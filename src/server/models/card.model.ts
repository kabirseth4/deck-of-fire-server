import type { Id, Card, NewCard } from "../types/index.js";
import knex from "../configs/knex.config.js";

export class CardModel {
  static readAll = async (userId: Id) => {
    const cards: Card[] = await knex("card")
      .where({ user_id: userId })
      .select("id", "name", "description");
    return cards;
  };

  static readOne = async (cardId: Id) => {
    const card: Card = await knex("card")
      .select("id", "name", "description", "user_id")
      .where({ id: cardId })
      .first();
    return card;
  };

  static create = async (newCard: NewCard) => {
    const [newCardId] = await knex("card").insert(newCard);
    const createdCard: Card = await this.readOne(newCardId);
    delete createdCard.user_id;
    return createdCard;
  };
}
