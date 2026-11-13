import { gameRepository } from "../repositories/game.repository";
import type { CreateGameInput } from "../schemas/game.schema";

export class NotFoundError extends Error {
  statusCode = 404;
}

export const gameService = {
  listGames() {
    return gameRepository.findAll();
  },

  async getGame(id: number) {
    const game = await gameRepository.findById(id);
    if (!game) {
      throw new NotFoundError(`Game with id ${id} not found`);
    }
    return game;
  },

  createGame(input: CreateGameInput) {
    return gameRepository.create({ ...input, source: "MANUAL" });
  },
};
