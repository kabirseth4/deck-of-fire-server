import knex from "../configs/knex.config";
import { Id } from "../types/types";
import { NewUser, User, UserWithPassword } from "../types/user";

const getAll = async () => {
  const users: User[] = await knex("user").select("id", "username", "email");
  return users;
};

const getOne = async (id: Id) => {
  const user: UserWithPassword = await knex("user").where({ id }).first();
  return user;
};

const getOneByEmail = async (email: string) => {
  const user: UserWithPassword = await knex("user").where({ email }).first();
  return user;
};

const register = async (newUser: NewUser) => {
  const [createdUserId]: number[] = await knex("user").insert(newUser);
  const createdUser: User = await knex("user")
    .select("id", "username", "email")
    .where({ id: createdUserId })
    .first();
  return createdUser;
};

export default { getAll, getOne, getOneByEmail, register };
