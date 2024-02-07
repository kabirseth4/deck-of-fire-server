/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("deck_card", (table) => {
    table.increments("id").primary();
    table.integer("occurences").unsigned();
    table.integer("penalty").unsigned();
    table
      .integer("deck_id")
      .unsigned()
      .references("deck.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("card_id")
      .unsigned()
      .references("card.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("deck_card");
};
