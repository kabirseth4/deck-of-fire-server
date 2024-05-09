import { Request, Response } from "express";
import cardModel from "../models/card.model.js";
import { NewCard } from "../types/card.js";

export const allCards = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cards = await cardModel.getAll(userId);
    return res.json(cards);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to retrieve card data", error });
  }
};

export const newCard = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newCard: NewCard = { ...req.body, user_id: userId };

  try {
    const createdCard = await cardModel.addNew(newCard);
    return res.status(201).json(createdCard);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create new card.", error });
  }
};
