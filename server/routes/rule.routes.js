const express = require("express");
const router = express.Router({ mergeParams: true });

const { allRules, newRule } = require("../controllers/rule.controller");

router.route("/").get(allRules).post(newRule);

module.exports = router;
