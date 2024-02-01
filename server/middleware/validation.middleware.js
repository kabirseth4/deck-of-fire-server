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
    const deckData = await deckModel.getOne(deckId);

    if (!deckData) {
      return res
        .status(404)
        .json({ message: `Deck with ID ${deckId} not found.` });
    }

    if (String(deckData.user_id) !== userId) {
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
  const { userId, deckId } = req.params;
  const rules = req.body;

  const deckToUpdate = await deckModel.getOne(deckId);
  const deckToUpdateRules = await deckModel.getRules(deckId, "rule.id");

  if (!deckToUpdate.is_custom && deckToUpdateRules.length + rules.length > 13) {
    return res.status(400).json({
      message: "Number of rules for a standard deck cannot exceed 13.",
    });
  }

  const mappedRules = [];

  for (let i = 0; i < rules.length; i++) {
    const { rule_id, occurences, penalty } = rules[i];
    let mappedRule = { rule_id };

    // Validate request body properties
    if (!rule_id) {
      return res.status(400).json({
        message: "Each rule in request body must include a rule_id.",
      });
    }
    if (deckToUpdate.is_custom) {
      if (isNaN(occurences) || occurences < 1) {
        return res.status(400).json({
          message:
            "Each rule for a custom deck must include ccurences, which must be a positive number.",
        });
      }
      mappedRule.occurences = occurences;
    }
    if (deckToUpdate.is_scored) {
      if (isNaN(penalty) || penalty < 1) {
        return res.status(400).json({
          message:
            "Each rule for a scored deck must include a penalty, which must be a positive number.",
        });
      }
      mappedRule.penalty = penalty;
    }

    // Validate rule
    const rule = await ruleModel.getOne(rule_id);
    if (!rule) {
      return res.status(400).json({
        message: `Could not find rule ${rule_id}.`,
      });
    }
    if (rule.user_id !== Number(userId)) {
      return res.status(401).json({
        message: `Invalid authorization for rule ${rule_id}.`,
      });
    }

    let isRuleAdded = false;
    deckToUpdateRules.forEach((existingRule) => {
      if (existingRule.id === rule_id) isRuleAdded = true;
    });
    if (isRuleAdded)
      return res.status(400).json({
        message: `Rule ${rule_id} has already been added to deck ${deckId}.`,
      });

    mappedRules.push(mappedRule);
  }

  req.body = mappedRules;
  next();
};

module.exports = { user, deck, deckBody, ruleBody, deckRuleBody };
