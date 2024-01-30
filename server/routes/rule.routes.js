const express = require("express");
const router = express.Router({ mergeParams: true });

const validate = require("../middleware/validation.middleware");
const { allRules, newRule } = require("../controllers/rule.controller");

router.route("/").get(allRules).post(validate.ruleBody, newRule);

module.exports = router;
