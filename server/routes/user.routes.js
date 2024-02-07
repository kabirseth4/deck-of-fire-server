const express = require("express");
const router = express.Router({ mergeParams: true });

const deckRoutes = require("./deck.routes");
const cardRoutes = require("./card.routes");

router.use("/decks", deckRoutes);
router.use("/cards", cardRoutes);

module.exports = router;
