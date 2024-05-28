import type {
  NewUser,
  UserLogin,
  NewDeck,
  NewDeckCard,
  NewCard,
} from "../types/index.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel, deckModel, cardModel } from "../models/index.js";
import { defaultDeck, defaultCards } from "../data/index.js";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as NewUser;

  const hashedPassword = hashSync(password, 6);
  const newUser: NewUser = {
    username,
    email,
    password: hashedPassword,
  };

  try {
    const createdUser = await userModel.create(newUser);

    // Add default deck
    const defaultUserDeck: NewDeck = {
      ...defaultDeck,
      user_id: createdUser.id,
    };
    const addedDeck = await deckModel.create(defaultUserDeck);

    for (const card of defaultCards) {
      const cardToCreate: NewCard = { ...card, user_id: createdUser.id };
      const createdCard = await cardModel.create(cardToCreate);
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

export const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body as UserLogin;

  try {
    const user = await userModel.readOne(email);

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
