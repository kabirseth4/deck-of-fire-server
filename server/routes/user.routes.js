const express = require("express");
const router = express.Router({ mergeParams: true });

const deckRoutes = require("./deck.routes");
const ruleRoutes = require("./rule.routes");

router.use("/decks", deckRoutes);
router.use("/rules", ruleRoutes);

module.exports = router;
