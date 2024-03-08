import express, { json } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(json());
app.use(cors());

app.use("/users", userRoutes);

export default app;
