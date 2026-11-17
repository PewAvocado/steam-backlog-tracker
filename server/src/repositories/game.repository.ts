import { prisma } from "../lib/prisma";
import type { CreateGameInput, UpdateGameInput } from "../schemas/game.schema";

type CreateGameData = CreateGameInput & { source: "MANUAL" };

export const gameRepository = {
  findAll() {
    return prisma.game.findMany({
      orderBy: { id: "asc" },
    });
  },

  findById(id: number) {
    return prisma.game.findUnique({
      where: { id },
    });
  },

  create(data: CreateGameData) {
    return prisma.game.create({ data });
  },

  update(id: number, data: UpdateGameInput) {
    return prisma.game.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.game.delete({
      where: { id },
    });
  },
};
