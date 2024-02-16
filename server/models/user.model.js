const knex = require("knex")(require("../../db/knexfile"));

const getAll = async () => {
  const users = await knex("user").select("id", "username", "email");
  return users;
};

const getOne = async (id) => {
  const user = await knex("user").where({ id }).first();
  return user;
};

const getOneByEmail = async (email) => {
  const user = await knex("user").where({ email }).first();
  return user;
};

const register = async (newUser) => {
  const createdUserId = await knex("user").insert(newUser);
  const createdUser = await knex("user")
    .select("id", "first_name", "last_name", "username", "email")
    .where({ id: createdUserId[0] })
    .first();
  return createdUser;
};

module.exports = { getAll, getOne, getOneByEmail, register };
