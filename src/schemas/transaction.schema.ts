import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(0.01, "Kwota musi być większa niż 0"),
  description: z.string().min(1, "Opis jest wymagany"),
  categoryId: z.string().min(1, "Kategoria jest wymagana").optional(),
  accountId: z.string().min(1, "Konto jest wymagane"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.date(),
}).refine((data) => {
  // Dla wydatków categoryId jest wymagane
  if (data.type === 'EXPENSE' && !data.categoryId) {
    return false;
  }
  return true;
}, {
  message: "Kategoria jest wymagana dla wydatków",
  path: ["categoryId"]
});

export type TransactionSchema = z.infer<typeof transactionSchema>; 