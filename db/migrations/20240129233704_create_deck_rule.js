/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("deck_rule", (table) => {
    table.increments("id").primary();
    table.integer("occurences").unsigned().defaultTo(4);
    table.integer("penalty").defaultTo(1);
    table
      .integer("deck_id")
      .unsigned()
      .references("deck.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("rule_id")
      .unsigned()
      .references("rule.id")
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
  return knex.schema.dropTable("deck_rule");
};
