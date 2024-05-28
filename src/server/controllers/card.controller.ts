import type { NewCard } from "../types/index.js";
import { Request, Response } from "express";
import { cardModel } from "../models/index.js";

export const getAllCards = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cards = await cardModel.readAll(userId);
    return res.json(cards);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to retrieve card data", error });
  }
};

export const postNewCard = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newCard: NewCard = { ...req.body, user_id: userId };

  try {
    const createdCard = await cardModel.create(newCard);
    return res.status(201).json(createdCard);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create new card.", error });
  }
};
