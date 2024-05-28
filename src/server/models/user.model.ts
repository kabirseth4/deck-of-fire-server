import knex from "../configs/knex.config.js";
import type { Id, NewUser, User, UserWithPassword } from "../types/index.js";

export const getAll = async () => {
  const users: User[] = await knex("user").select("id", "username", "email");
  return users;
};

export const getOne = async (id: Id) => {
  const user: UserWithPassword = await knex("user").where({ id }).first();
  return user;
};

export const getOneByEmail = async (email: string) => {
  const user: UserWithPassword = await knex("user").where({ email }).first();
  return user;
};

export const register = async (newUser: NewUser) => {
  const [createdUserId]: number[] = await knex("user").insert(newUser);
  const createdUser: User = await knex("user")
    .select("id", "username", "email")
    .where({ id: createdUserId })
    .first();
  return createdUser;
};
