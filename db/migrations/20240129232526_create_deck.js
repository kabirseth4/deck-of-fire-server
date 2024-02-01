/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("deck", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.boolean("is_scored").defaultTo(false);
    table.boolean("is_custom").defaultTo(false);
    table.boolean("is_playable").defaultTo(false);
    table
      .integer("user_id")
      .unsigned()
      .references("user.id")
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
  return knex.schema.dropTable("deck");
};
