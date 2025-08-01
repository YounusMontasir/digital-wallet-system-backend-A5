import { z } from "zod";
import { TransactionType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
  receiverPhoneNumber: z
    .string(),

  transactionType: z.enum(TransactionType),

  amount: z.number()
});
