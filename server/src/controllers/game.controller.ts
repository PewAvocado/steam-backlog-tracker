import type { Request, Response } from "express";
import { gameService, NotFoundError } from "../services/game.service";
import type { CreateGameInput } from "../schemas/game.schema";

export const gameController = {
  async list(_req: Request, res: Response) {
    const games = await gameService.listGames();
    res.status(200).json({ data: games });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const game = await gameService.getGame(id);
      res.status(200).json(game);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ error: { message: err.message } });
        return;
      }
      throw err;
    }
  },

  async create(req: Request, res: Response) {
    const input = req.body as CreateGameInput;
    const game = await gameService.createGame(input);
    res.status(201).json(game);
  },
};
