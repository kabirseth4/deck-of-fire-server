import { config } from "dotenv";
import app from "./server/app.js";

config();

const { PORT: port } = process.env;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
