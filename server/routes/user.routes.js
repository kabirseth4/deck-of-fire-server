const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const authenticate = require("../middleware/auth.middleware");

const deckRoutes = require("./deck.routes");
const cardRoutes = require("./card.routes");

const { registerUser } = require("../controllers/user.controller");

router.route("/register").post(registerUser);

router.use("/:userId", validate.user, authenticate.user);
router.use("/:userId/decks", deckRoutes);
router.use("/:userId/cards", cardRoutes);

module.exports = router;
