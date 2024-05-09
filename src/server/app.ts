import express, { json, Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app: Application = express();

app.use(json());
app.use(cors());

app.use("/users", userRoutes);

export default app;
