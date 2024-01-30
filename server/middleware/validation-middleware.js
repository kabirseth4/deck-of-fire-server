const knex = require("knex")(require("../../db/knexfile"));

const validateDeckId = async (req, res, next) => {
  const { deckId: id } = req.params;
  try {
    const deck = await knex("deck").where({ id }).first();

    if (!deck) {
      return res.status(404).json({ message: `Deck with ID ${id} not found.` });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to retrieve deck with ID " + id, error });
  }
};

module.exports = { validateDeckId };
