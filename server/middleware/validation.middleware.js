import userModel from "../models/user.model.js";
import deckModel from "../models/deck.model.js";
import cardModel from "../models/card.model.js";
import { validateEmail } from "../utils/validation.utils.js";

const user = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await userModel.getOne(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: `Unable to validate user with ID ${userId}.`,
      error,
    });
  }
};

const deck = async (req, res, next) => {
  const { userId, deckId } = req.params;

  try {
    const deckData = await deckModel.getOne(deckId);

    if (!deckData) {
      return res
        .status(404)
        .json({ message: `Deck with ID ${deckId} not found.` });
    }

    if (String(deckData.user_id) !== userId) {
      return res.status(401).json({
        message: `Invalid authorization for deck with ID ${deckId}.`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: `Unable to validate deck with ID ${deckId}.`,
      error,
    });
  }
};

const registerUserBody = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Request body must include username, email, and password.",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "Email must be a valid format.",
    });
  }

  try {
    const existingUsers = await userModel.getAll();

    const isUnique = { email: true, username: true };
    existingUsers.forEach((user) => {
      if (user.email == email) isUnique.email = false;
      if (user.username == username) isUnique.username = false;
    });

    if (!isUnique.email) {
      return res.status(409).json({
        type: "EMAIL_TAKEN",
        message: `Account with email ${email} already exists.`,
      });
    }
    if (!isUnique.username) {
      return res.status(409).json({
        type: "USERNAME_TAKEN",
        message: `Username ${username} is already taken.`,
      });
    }

    req.body = { username, email, password };
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to validate request body.", error });
  }
};

const loginUserBody = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Request body must include email and password.",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "Email must be a valid format.",
    });
  }

  req.body = { email, password };
  next();
};

const deckBody = async (req, res, next) => {
  const { name, is_scored, is_custom } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Request body must include a name.",
    });
  }

  req.body = { name, is_scored, is_custom };
  next();
};

const cardBody = async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: "Request body must include a name and description.",
    });
  }

  req.body = { name, description };
  next();
};

const deckCardBody = async (req, res, next) => {
  const { userId, deckId } = req.params;
  const cards = req.body;

  try {
    const deckToUpdate = await deckModel.getOne(deckId);
    const deckToUpdateCards = await deckModel.getCards(deckId, "card.id");

    if (
      !deckToUpdate.is_custom &&
      deckToUpdateCards.length + cards.length > 13
    ) {
      return res.status(409).json({
        message: "Number of cards for a standard deck cannot exceed 13.",
      });
    }

    if (!Array.isArray(cards) || cards.length < 1) {
      return res.status(400).json({
        message: "Request body must be an array of objects.",
      });
    }

    const mappedCards = [];

    for (let i = 0; i < cards.length; i++) {
      const { card_id, occurences, penalty } = cards[i];
      let mappedCard = { card_id };

      // Validate request body properties
      if (!card_id) {
        return res.status(400).json({
          message: "Each card in request body must include a card_id.",
        });
      }
      if (deckToUpdate.is_custom) {
        if (isNaN(occurences) || occurences < 1) {
          return res.status(400).json({
            message:
              "Each card for a custom deck must include ccurences, which must be a positive number.",
          });
        }
        mappedCard.occurences = occurences;
      }
      if (deckToUpdate.is_scored) {
        if (isNaN(penalty) || penalty < 1) {
          return res.status(400).json({
            message:
              "Each card for a scored deck must include a penalty, which must be a positive number.",
          });
        }
        mappedCard.penalty = penalty;
      }

      // Validate card
      const card = await cardModel.getOne(card_id);
      if (!card) {
        return res.status(404).json({
          message: `Could not find card ${card_id}.`,
        });
      }
      if (card.user_id !== Number(userId)) {
        return res.status(401).json({
          message: `Invalid authorization for card ${card_id}.`,
        });
      }

      let isCardAdded = false;
      deckToUpdateCards.forEach((existingCard) => {
        if (existingCard.id === card_id) isCardAdded = true;
      });
      if (isCardAdded)
        return res.status(409).json({
          message: `Card ${card_id} has already been added to deck ${deckId}.`,
        });

      mappedCards.push(mappedCard);
    }

    req.body = mappedCards;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to validate request body.", error });
  }
};

export default {
  user,
  deck,
  registerUserBody,
  loginUserBody,
  deckBody,
  cardBody,
  deckCardBody,
};
