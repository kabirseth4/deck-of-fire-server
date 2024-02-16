const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const authorize = require("../middleware/auth.middleware");

const deckRoutes = require("./deck.routes");
const cardRoutes = require("./card.routes");

const {
  allUsers,
  registerUser,
  loginUser,
} = require("../controllers/user.controller");

router.route("/").get(allUsers);
router.route("/register").post(validate.registerUserBody, registerUser);
router.route("/login").post(validate.loginUserBody, loginUser);

router.use("/:userId", validate.user, authorize.user);
router.use("/:userId/decks", deckRoutes);
router.use("/:userId/cards", cardRoutes);

module.exports = router;
