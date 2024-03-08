import deckData from "../seed-data/deck.data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("deck").del();
  await knex("deck").insert(deckData);
}
