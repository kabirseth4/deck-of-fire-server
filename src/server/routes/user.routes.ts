import { Router } from "express";
import { authorize, validate } from "../middleware/index.js";
import { deckRoutes } from "./deck.routes.js";
import { cardRoutes } from "./card.routes.js";
import { userController } from "../controllers/index.js";

export const userRoutes = Router({ mergeParams: true });

userRoutes
  .route("/register")
  .post(validate.registerUserBody, userController.registerUser);
userRoutes
  .route("/login")
  .post(validate.loginUserBody, userController.loginUser);

userRoutes.use("/:userId", validate.user, authorize.user);
userRoutes.use("/:userId/decks", deckRoutes);
userRoutes.use("/:userId/cards", cardRoutes);
