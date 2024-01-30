const userModel = require("../models/user.model");
const deckModel = require("../models/deck.model");
const ruleModel = require("../models/rule.model");

const user = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await userModel.getOne(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve data for user with ID ${userId}.`,
      error,
    });
  }
};

const deck = async (req, res, next) => {
  const { userId, deckId } = req.params;

  try {
    const deck = await deckModel.getOne(deckId);

    if (!deck) {
      return res
        .status(404)
        .json({ message: `Deck with ID ${deckId} not found.` });
    }

    if (String(deck.user_id) !== userId) {
      return res.status(401).json({
        message: `Invalid authorization for deck with ID ${deckId}.`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: `Unable to validate deck with ID ${deckId}.`,
      error,
    });
  }
};

const deckBody = async (req, res, next) => {
  const { name, is_scored, is_custom } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Request body must include a name.",
    });
  }

  req.body = { name, is_scored, is_custom };
  next();
};

const ruleBody = async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: "Request body must include a name and description.",
    });
  }

  req.body = { name, description };
  next();
};

const deckRuleBody = async (req, res, next) => {
  const { userId } = req.params;
  const rules = req.body;
  const mappedRules = [];

  for (let i = 0; i < rules.length; i++) {
    const { rule_id, occurences, penalty } = rules[i];

    // Validate request body properties
    if (!rule_id) {
      return res.status(400).json({
        message: "Each rule in request body must include a rule_id.",
      });
    }
    if (typeof occurences !== "undefined" && isNaN(occurences)) {
      return res.status(400).json({
        message: "Occurences must be a number.",
      });
    }
    if (typeof penalty !== "undefined" && isNaN(penalty)) {
      return res.status(400).json({
        message: "Penalty must be a number.",
      });
    }

    // Validate rule
    const rule = await ruleModel.getOne(rule_id);
    if (!rule) {
      return res.status(400).json({
        message: `Could not find rule with ID ${rule_id}.`,
      });
    }
    if (rule.user_id !== Number(userId)) {
      return res.status(401).json({
        message: `Invalid authorization for rule with ID ${rule_id}.`,
      });
    }

    mappedRules.push({ rule_id, occurences, penalty });
  }

  req.body = mappedRules;
  next();
};

module.exports = { user, deck, deckBody, ruleBody, deckRuleBody };
