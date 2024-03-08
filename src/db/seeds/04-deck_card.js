import deckCardData from "../seed-data/deck_card.data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("deck_card").del();
  await knex("deck_card").insert(deckCardData);
}
