const ruleModel = require("../models/rule.model");

const allRules = async (req, res) => {
  const { userId } = req.params;

  try {
    const rules = await ruleModel.getAll(userId);
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve rule data", error });
  }
};

const newRule = async (req, res) => {
  const { userId } = req.params;
  const newRule = { ...req.body, user_id: userId };

  try {
    const createdRule = await ruleModel.addNew(newRule);
    res.json(createdRule);
  } catch (error) {
    res.status(500).json({ message: "Unable to create new rule.", error });
  }
};

module.exports = { allRules, newRule };
