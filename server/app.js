const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { authenticateUser } = require("./middleware/auth.middleware");
const decksRoutes = require("./routes/decks.routes");

app.use(express.json());
app.use(cors());

app.use(authenticateUser);
app.use("/decks", decksRoutes);

module.exports = app;
