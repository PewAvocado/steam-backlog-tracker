import { Router } from "express";
import { gameController } from "../controllers/game.controller";

export const gameRouter = Router();

gameRouter.get("/", gameController.list);
gameRouter.get("/:id", gameController.getById);
gameRouter.post("/", gameController.create);
