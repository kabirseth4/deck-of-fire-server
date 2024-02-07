const cardData = require("../seed-data/card.data");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("card").del();
  await knex("card").insert(cardData);
};
