import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel, deckModel, cardModel } from "../models/index.js";
import { defaultDeck, defaultCards } from "../data/index.js";
import { NewUser, UserLogin } from "../types/user.js";
import { NewDeck, NewDeckCard } from "../types/deck.js";
import { NewCard } from "../types/card.js";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as NewUser;

  const hashedPassword = hashSync(password, 6);
  const newUser: NewUser = {
    username,
    email,
    password: hashedPassword,
  };

  try {
    const createdUser = await userModel.register(newUser);

    // Add default deck
    const defaultUserDeck: NewDeck = {
      ...defaultDeck,
      user_id: createdUser.id,
    };
    const addedDeck = await deckModel.addNew(defaultUserDeck);

    for (const card of defaultCards) {
      const cardToCreate: NewCard = { ...card, user_id: createdUser.id };
      const createdCard = await cardModel.addNew(cardToCreate);
      const cardToAdd: NewDeckCard = {
        card_id: createdCard.id,
        deck_id: addedDeck.id,
      };
      await deckModel.addCard(addedDeck.id, cardToAdd);
    }

    await deckModel.setAsPlayable(addedDeck.id);

    return res.status(201).json(createdUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to register new user.", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as UserLogin;

  try {
    const user = await userModel.getOneByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isPasswordCorrect = compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "28d" }
    );

    return res.json({ id: user.id, token });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error });
  }
};
