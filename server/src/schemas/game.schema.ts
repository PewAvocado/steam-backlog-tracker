import { z } from "zod";

export const GAME_STATUSES = ["BACKLOG", "PLAYING", "COMPLETED", "ABANDONED"] as const;

export const createGameSchema = z.object({
  name: z.string().trim().min(1, "Name is a must"),
  status: z.enum(GAME_STATUSES).default("BACKLOG"),
  priority: z.int().min(1).max(3).default(2),
  rating: z.int().min(1).max(10).optional(),
  notes: z.string().trim().optional(),
});

export const gameIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateGameSchema = z
  .object({
    status: z.enum(GAME_STATUSES).optional(),
    priority: z.int().min(1).max(3).optional(),
    rating: z.int().min(1).max(10).nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    startedAt: z.coerce.date().nullable().optional(),
    finishedAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "You need to send at least 1 change to update",
  });

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type GameIdParam = z.infer<typeof gameIdParamSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
