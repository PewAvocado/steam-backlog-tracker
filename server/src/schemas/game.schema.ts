import { z } from "zod";

export const GAME_STATUSES = ["BACKLOG", "PLAYING", "COMPLETED", "ABANDONED"] as const;

export const createGameSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  status: z.enum(GAME_STATUSES).default("BACKLOG"),
  priority: z.int().min(1).max(3).default(2),
  rating: z.int().min(1).max(10).optional(),
  notes: z.string().trim().optional(),
});

export const gameIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type GameIdParam = z.infer<typeof gameIdParamSchema>;
