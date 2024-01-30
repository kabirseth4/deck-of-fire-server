const user = async (req, res, next) => {
  const authId = req.headers.authorization;
  const { userId } = req.params;

  if (!authId) {
    return res.status(401).json({
      message: "Invalid authorization: no auth token.",
    });
  }

  if (authId !== userId) {
    return res.status(401).json({
      message: `Invalid authorization: auth token not valid for user with ID ${userId}.`,
    });
  }

  next();
};

module.exports = { user };
