import { Router } from "express";
import { validate } from "../middleware/index.js";
import { deckController } from "../controllers/index.js";

export const deckRoutes = Router({ mergeParams: true });

deckRoutes
  .route("/")
  .get(deckController.allDecks)
  .post(validate.deckBody, deckController.newDeck);

deckRoutes.use("/:deckId", validate.deck);
deckRoutes.route("/:deckId").get(deckController.singleDeck);
deckRoutes
  .route("/:deckId/cards")
  .post(validate.deckCardBody, deckController.cardsToDeck);
