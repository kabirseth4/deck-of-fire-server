const knex = require("knex")(require("../../db/knexfile"));

const index = async (_req, res) => {
  try {
    const decks = await knex("deck").select(
      "id",
      "name",
      "is_scored",
      "is_standard"
    );
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve deck data", error });
  }
};

module.exports = { index };
