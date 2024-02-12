const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const registerUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 6);

  const newUser = {
    first_name,
    last_name,
    username,
    email,
    password: hashedPassword,
  };

  try {
    const createdUser = await userModel.register(newUser);
    return res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Unable to register new user." });
  }
};

module.exports = { registerUser };
