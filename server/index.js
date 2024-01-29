const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { PORT: port } = process.env;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Server running on port " + port);
});
