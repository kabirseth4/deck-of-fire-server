const deckCardData = require("../seed-data/deck_card.data");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("deck_card").del();
  await knex("deck_card").insert(deckCardData);
};
