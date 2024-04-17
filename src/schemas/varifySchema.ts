import { z } from "zod";

export const varifySchema = z.object({
  code: z.string().length(6, "Varification code must be 6 charecter"),
});
