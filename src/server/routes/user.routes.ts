import { Router } from "express";
import { authorize, validate } from "../middleware/index.js";
import { deckRoutes } from "./deck.routes.js";
import { cardRoutes } from "./card.routes.js";
import { userController } from "../controllers/index.js";

export const userRoutes = Router({ mergeParams: true });

userRoutes
  .route("/register")
  .post(validate.registerBody, userController.register);
userRoutes.route("/login").post(validate.logInBody, userController.logIn);

userRoutes.use("/:userId", validate.user, authorize.user);
userRoutes.use("/:userId/decks", deckRoutes);
userRoutes.use("/:userId/cards", cardRoutes);
