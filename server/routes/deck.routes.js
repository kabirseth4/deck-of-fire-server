import { Router } from "express";
import validate from "../middleware/validation.middleware.js";
import {
  allDecks,
  singleDeck,
  newDeck,
  cardsToDeck,
} from "../controllers/deck.controller.js";

const router = Router({ mergeParams: true });

router.route("/").get(allDecks).post(validate.deckBody, newDeck);

router.use("/:deckId", validate.deck);
router.route("/:deckId").get(singleDeck);
router.route("/:deckId/cards").post(validate.deckCardBody, cardsToDeck);

export default router;
