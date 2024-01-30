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

module.exports = { allRules };
