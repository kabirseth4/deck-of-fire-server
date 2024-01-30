const express = require("express");
const router = express.Router();
const { index, singleDeck } = require("../controllers/deck.controller");
const { validateDeckId } = require("../middleware/validation.middleware");

router.route("/").get(index).post();

router.use("/:deckId", validateDeckId);
router.route("/:deckId").get(singleDeck);

module.exports = router;
