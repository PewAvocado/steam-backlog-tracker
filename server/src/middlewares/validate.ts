import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

type Source = "body" | "params";

export function validate(schema: ZodType, source: Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    req[source] = result.data as never;
    next();
  };
}
