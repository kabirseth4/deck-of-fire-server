import { Router } from "express";
import { validate } from "../middleware/index.js";
import { deckController } from "../controllers/index.js";

export const deckRoutes = Router({ mergeParams: true });

deckRoutes
  .route("/")
  .get(deckController.getAllDecks)
  .post(validate.deckBody, deckController.postNewDeck);

deckRoutes.use("/:deckId", validate.deck);

deckRoutes
  .route("/:deckId")
  .get(deckController.getSingleDeck)
  .delete(deckController.deleteDeck);

deckRoutes
  .route("/:deckId/cards")
  .post(validate.deckCardBody, deckController.postCardsToDeck);
