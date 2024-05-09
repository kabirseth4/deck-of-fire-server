import { Knex } from "knex";
import userData from "../seed-data/user.data.js";

export async function seed(knex: Knex): Promise<void> {
  await knex("user").del();
  await knex("user").insert(userData);
}
