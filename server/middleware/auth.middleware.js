const jwt = require("jsonwebtoken");

const user = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userId = Number(req.params.userId);

  if (!authHeader) {
    return res.status(401).json({
      message: "Invalid authorization: no authorization header.",
    });
  }

  const authToken = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (decodedToken.id !== userId) {
      return res.status(401).json({
        message: `Invalid authorization: auth token not valid for user with ID ${userId}.`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Unable to authorize user." });
  }
};

module.exports = { user };
