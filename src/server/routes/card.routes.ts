import { Router } from "express";
import validate from "../middleware/validation.middleware";
import { allCards, newCard } from "../controllers/card.controller";

const router = Router({ mergeParams: true });

router.route("/").get(allCards).post(validate.cardBody, newCard);

export default router;
