const express = require("express");
const app = express();
const cors = require("cors");

const validate = require("./middleware/validation.middleware");
const authenticate = require("./middleware/auth.middleware");
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cors());

app.use("/users/:userId", validate.user, authenticate.user, userRoutes);

module.exports = app;
