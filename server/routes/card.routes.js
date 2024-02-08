const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const { allCards, newCard } = require("../controllers/card.controller");

router.route("/").get(allCards).post(validate.cardBody, newCard);

module.exports = router;
