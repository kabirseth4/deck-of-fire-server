import { config } from "dotenv";
import app from "./server/app.js";

config({ path: "../.env" });

const { PORT: port } = process.env;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
