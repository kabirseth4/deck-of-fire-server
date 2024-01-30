const knex = require("knex")(require("../../db/knexfile"));

const authenticateUser = async (req, res, next) => {
  const userId = Number(req.headers.authorization);

  if (!userId) {
    return res.status(401).json({
      message: "Invalid authorization: no authorization header.",
    });
  }

  try {
    const user = await knex("user").where({ id: userId }).first();

    if (!user) {
      return res.status(401).json({
        message: `Invalid authorization: user with id ${userId} not found.`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error authorizing user.", error });
  }
};

module.exports = { authenticateUser };
