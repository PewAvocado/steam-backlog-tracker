import express from "express";
import cors from "cors";
import { gameRouter } from "./routes/game.routes";
import { AppError } from "./errors/app.error";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/games", gameRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next;
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  }
  console.error("ERROR CANNOT BE CONTROLLED:", err);
  return res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
});
