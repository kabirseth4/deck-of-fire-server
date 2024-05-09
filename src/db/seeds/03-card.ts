import { Knex } from "knex";
import cardData from "../seed-data/card.data.js";

export async function seed(knex: Knex): Promise<void> {
  await knex("card").del();
  await knex("card").insert(cardData);
}
