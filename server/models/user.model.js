const knex = require("knex")(require("../../db/knexfile"));

const getOne = async (userId) => {
  const user = await knex("user").where({ id: userId }).first();
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

module.exports = { getOne, register };
