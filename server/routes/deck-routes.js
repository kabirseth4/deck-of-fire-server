const express = require("express");
const router = express.Router();
const { index } = require("../controllers/deck-controller");

router.route("/").get(index).post();
router.route("/:deckId").get();

module.exports = router;
