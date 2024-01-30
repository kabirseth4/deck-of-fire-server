const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const {
  allDecks,
  singleDeck,
  newDeck,
  rulesToDeck,
} = require("../controllers/deck.controller");

router.route("/").get(allDecks).post(validate.deckBody, newDeck);

router.use("/:deckId", validate.deck);
router.route("/:deckId").get(singleDeck);
router.route("/:deckId/rules").post(validate.deckRuleBody, rulesToDeck);

module.exports = router;
