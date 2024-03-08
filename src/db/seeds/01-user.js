import userData from "../seed-data/user.data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("user").del();
  await knex("user").insert(userData);
}
