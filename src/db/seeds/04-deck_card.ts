import { Knex } from "knex";
import deckCardData from "../seed-data/deck_card.data";

export async function seed(knex: Knex): Promise<void> {
  await knex("deck_card").del();
  await knex("deck_card").insert(deckCardData);
}
