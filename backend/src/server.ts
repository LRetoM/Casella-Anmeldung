import "dotenv/config";

import { join } from "node:path";

import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";

import { submissionRouter } from "./routes/SubmissionRoute.js";
import { DEFAULT_PORT, FRONTEND_BUILD_DIRECTORY, JSON_BODY_SIZE_LIMIT } from "./constants/StaticValues.js";

const app: Express = express();
const port: number = Number(process.env.PORT) || DEFAULT_PORT;
const frontendBuildPath: string = join(process.cwd(), FRONTEND_BUILD_DIRECTORY);

app.use(cors());
app.use(express.json({ limit: JSON_BODY_SIZE_LIMIT }));
app.use(submissionRouter);
app.use(express.static(frontendBuildPath));

app.use((request: Request, response: Response, next: NextFunction): void => {
    if (request.method !== "GET") {
        next();
        return;
    }
    response.sendFile(join(frontendBuildPath, "index.html"));
});

app.listen(port, (): void => {
    console.log(`Backend läuft auf http://localhost:${port}`);
});
