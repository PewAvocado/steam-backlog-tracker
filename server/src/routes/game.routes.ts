import { Router } from "express";
import { gameController } from "../controllers/game.controller";
import { validate } from "../middlewares/validate";
import { createGameSchema, gameIdParamSchema, updateGameSchema } from "../schemas/game.schema";

export const gameRouter = Router();

gameRouter.get("/", gameController.list);
gameRouter.get("/:id", validate(gameIdParamSchema, "params"), gameController.getById);
gameRouter.post("/", validate(createGameSchema), gameController.create);
gameRouter.patch(
  "/:id",
  validate(gameIdParamSchema, "params"),
  validate(updateGameSchema),
  gameController.update,
);
