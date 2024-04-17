import { z } from "zod";

export const usernameValidataion = z
  .string()
  .min(2, "Username must be more than 2 charecter")
  .max(20, "Username not more than 20 charecter")
  .regex(/^[a-zA-Z0-9_]{5,16}$/, "Username not contain special charecter");

export const signUpSchema = z.object({
  username: usernameValidataion,
  email: z.string().email({ message: "Invalid Email address" }),
  password: z.string().min(6, { message: "Password must contain 6 charecter" }),
});
