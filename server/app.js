const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { authenticateUser } = require("./middleware/authentication-middleware");
const deckRoutes = require("./routes/deck-routes");

app.use(express.json());
app.use(cors());

app.use(authenticateUser);
app.use("/decks", deckRoutes);

module.exports = app;
