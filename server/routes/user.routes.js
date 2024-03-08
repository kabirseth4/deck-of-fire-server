import { Router } from "express";
import validate from "../middleware/validation.middleware.js";
import authorize from "../middleware/auth.middleware.js";
import deckRoutes from "./deck.routes.js";
import cardRoutes from "./card.routes.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router({ mergeParams: true });

router.route("/register").post(validate.registerUserBody, registerUser);
router.route("/login").post(validate.loginUserBody, loginUser);

router.use("/:userId", validate.user, authorize.user);
router.use("/:userId/decks", deckRoutes);
router.use("/:userId/cards", cardRoutes);

export default router;
