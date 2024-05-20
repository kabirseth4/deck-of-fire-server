import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("deck_card", (table) => {
    table.renameColumn("occurences", "occurrences");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("deck_card", (table) => {
    table.renameColumn("occurrences", "occurences");
  });
}
