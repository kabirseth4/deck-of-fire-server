const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const allUsers = async (_req, res) => {
  try {
    const users = await userModel.getAll();
    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve users.", error });
  }
};

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
    res.status(500).json({ message: "Unable to register new user.", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getOneByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "28d" }
    );

    res.json({ id: user.id, token });
  } catch (error) {
    res.status(500).json({ message: "Unable to log in user.", error });
  }
};

module.exports = { allUsers, registerUser, loginUser };
