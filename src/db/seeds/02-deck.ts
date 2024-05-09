import { Knex } from "knex";
import deckData from "../seed-data/deck.data.js";

export async function seed(knex: Knex): Promise<void> {
  await knex("deck").del();
  await knex("deck").insert(deckData);
}
