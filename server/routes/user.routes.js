const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const authorize = require("../middleware/auth.middleware");

const deckRoutes = require("./deck.routes");
const cardRoutes = require("./card.routes");

const { registerUser, loginUser } = require("../controllers/user.controller");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.use("/:userId", validate.user, authorize.user);
router.use("/:userId/decks", deckRoutes);
router.use("/:userId/cards", cardRoutes);

module.exports = router;
