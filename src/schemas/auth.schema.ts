import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type AuthSchema = z.infer<typeof authSchema>; 