import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must contain 10 charecter" })
    .max(200, { message: "Content must not contain more than 200 charecter" }),
});
