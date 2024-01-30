const express = require("express");
const router = express.Router({ mergeParams: true });

const deckRoutes = require("./deck.routes");

router.use("/decks", deckRoutes);

module.exports = router;
