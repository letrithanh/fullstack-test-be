import express, { Application } from "express";
import dotenv from "dotenv";
import eventRoutes, { EVENT_PATH } from "./boundary/event/eventRoutes";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use(`/${EVENT_PATH}`, eventRoutes)

export default app;
