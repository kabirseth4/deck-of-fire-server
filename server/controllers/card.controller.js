const cardModel = require("../models/card.model");

const allCards = async (req, res) => {
  const { userId } = req.params;

  try {
    const cards = await cardModel.getAll(userId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve card data", error });
  }
};

const newCard = async (req, res) => {
  const { userId } = req.params;
  const newCard = { ...req.body, user_id: userId };

  try {
    const createdCard = await cardModel.addNew(newCard);
    res.status(201).json(createdCard);
  } catch (error) {
    res.status(500).json({ message: "Unable to create new card.", error });
  }
};

module.exports = { allCards, newCard };
