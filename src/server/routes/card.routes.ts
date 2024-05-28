import { Router } from "express";
import { validate } from "../middleware/index.js";
import { cardController } from "../controllers/index.js";

export const cardRoutes = Router({ mergeParams: true });

cardRoutes
  .route("/")
  .get(cardController.allCards)
  .post(validate.cardBody, cardController.newCard);
