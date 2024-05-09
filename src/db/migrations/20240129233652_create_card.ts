import { Knex } from "knex";

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("card", (table) => {
    table.increments("id").primary();
    table.string("name", 25).notNullable();
    table.string("description", 100).notNullable();
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
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("card");
}
