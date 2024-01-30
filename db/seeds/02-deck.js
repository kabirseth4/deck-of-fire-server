const deckData = require("../seed-data/deck-data");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("deck").del();
  await knex("deck").insert(deckData);
};
