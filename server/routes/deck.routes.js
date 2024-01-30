const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const { allDecks, singleDeck } = require("../controllers/deck.controller");

router.route("/").get(allDecks).post();

router.use("/:deckId", validate.deck);
router.route("/:deckId").get(singleDeck);

module.exports = router;
