import cardData from "../seed-data/card.data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("card").del();
  await knex("card").insert(cardData);
}
