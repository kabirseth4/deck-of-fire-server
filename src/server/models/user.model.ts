import type { Id, NewUser, User, UserWithPassword } from "../types/index.js";
import knex from "../configs/knex.config.js";
import { validateEmail } from "../utils/validation.utils.js";

export const readAll = async () => {
  const users: User[] = await knex("user").select("id", "username", "email");
  return users;
};

export const readOne = async (idOrEmail: Id | string) => {
  const query = validateEmail(idOrEmail)
    ? { email: idOrEmail }
    : { id: idOrEmail };

  const user: UserWithPassword = await knex("user").where(query).first();
  return user;
};

export const create = async (newUser: NewUser) => {
  const [createdUserId]: number[] = await knex("user").insert(newUser);
  const createdUser: User = await knex("user")
    .select("id", "username", "email")
    .where({ id: createdUserId })
    .first();
  return createdUser;
};
