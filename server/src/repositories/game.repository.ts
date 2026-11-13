import { prisma } from "../lib/prisma";
import type { CreateGameInput } from "../schemas/game.schema";

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
};
