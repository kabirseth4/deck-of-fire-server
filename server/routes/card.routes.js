import { Router } from "express";
import validate from "../middleware/validation.middleware.js";
import { allCards, newCard } from "../controllers/card.controller.js";

const router = Router({ mergeParams: true });

router.route("/").get(allCards).post(validate.cardBody, newCard);

export default router;
