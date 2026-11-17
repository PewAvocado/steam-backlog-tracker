import { NotFoundError } from "../errors/app.error";
import { gameRepository } from "../repositories/game.repository";
import type { CreateGameInput, UpdateGameInput } from "../schemas/game.schema";

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

  async updateGame(id: number, input: UpdateGameInput) {
    const existingGame = await this.getGame(id);
    const dataToUpdate: UpdateGameInput = { ...input };

    if (
      input.status === "COMPLETED" &&
      input.finished_at === undefined &&
      !existingGame.finished_at
    ) {
      dataToUpdate.finished_at = new Date();
    }
    return gameRepository.update(id, dataToUpdate);
  },

  async deleteGame(id: number) {
    await this.getGame(id);
    return gameRepository.delete(id);
  },
};
