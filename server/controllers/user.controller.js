const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const deckModel = require("../models/deck.model");
const cardModel = require("../models/card.model");

const defaultCards = require("../data/default-cards.data");
const defaultDeck = require("../data/default-deck.data");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 6);
  const newUser = {
    username,
    email,
    password: hashedPassword,
  };

  try {
    const createdUser = await userModel.register(newUser);

    // Add default cards
    const addedCardIds = await Promise.all(
      defaultCards.map(async (card) => {
        const cardToAdd = { ...card, user_id: createdUser.id };
        const addedCard = await cardModel.addNew(cardToAdd);
        return addedCard.id;
      })
    );

    // Add default deck
    const defaultUserDeck = { ...defaultDeck, user_id: createdUser.id };
    const addedDeck = await deckModel.addNew(defaultUserDeck);

    // Add default cards to default deck and set as playable
    await Promise.all(
      addedCardIds.map(async (cardId) => {
        const cardToAdd = { card_id: cardId, deck_id: addedDeck.id };
        await deckModel.addCard(addedDeck.id, cardToAdd);
      })
    );
    await deckModel.setAsPlayable(addedDeck.id);

    return res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Unable to register new user.", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getOneByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "28d" }
    );

    res.json({ id: user.id, token });
  } catch (error) {
    res.status(500).json({ message: "Unable to log in user.", error });
  }
};

module.exports = { registerUser, loginUser };
