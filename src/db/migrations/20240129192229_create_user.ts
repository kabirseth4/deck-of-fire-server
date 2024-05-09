import { Knex } from "knex";

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("username", 32).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export function down(knex: import("knex").Knex): Promise<void> {
  return knex.schema.dropTable("user");
}
