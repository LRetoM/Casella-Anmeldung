import "dotenv/config";

import cors from "cors";
import express, { type Express } from "express";

import { submissionRouter } from "./routes/SubmissionRoute.js";
import { DEFAULT_PORT, JSON_BODY_SIZE_LIMIT } from "./constants/StaticValues.js";

const app: Express = express();
const port: number = Number(process.env.PORT) || DEFAULT_PORT;

app.use(cors());
app.use(express.json({ limit: JSON_BODY_SIZE_LIMIT }));
app.use(submissionRouter);

app.listen(port, (): void => {
    console.log(`Backend läuft auf http://localhost:${port}`);
});
