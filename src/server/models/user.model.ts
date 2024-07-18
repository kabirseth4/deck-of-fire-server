import type { Id, NewUser, User, UserWithPassword } from "../types/index.js";
import knex from "../configs/knex.config.js";
import { validateEmail } from "../utils/validation.utils.js";

export class UserModel {
  static readAll = async () => {
    const users: User[] = await knex("user").select("id", "username", "email");
    return users;
  };

  static readOne = async (idOrEmail: Id | string) => {
    const query = validateEmail(idOrEmail)
      ? { email: idOrEmail }
      : { id: idOrEmail };

    const user: UserWithPassword = await knex("user").where(query).first();
    return user;
  };

  static create = async (newUser: NewUser) => {
    const [createdUserId]: number[] = await knex("user").insert(newUser);
    const createdUser: User = await knex("user")
      .select("id", "username", "email")
      .where({ id: createdUserId })
      .first();
    return createdUser;
  };
}
