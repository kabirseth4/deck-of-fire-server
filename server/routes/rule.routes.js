const express = require("express");
const router = express.Router({ mergeParams: true });

const { allRules } = require("../controllers/rule.controller");

router.route("/").get(allRules);

module.exports = router;
