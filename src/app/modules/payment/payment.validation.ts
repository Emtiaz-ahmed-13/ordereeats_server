import { z } from "zod";

const createPaymentIntentSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be a positive number")
      .int("Amount must be in smallest currency unit"),
    currency: z
      .string()
      .length(3, "Currency code must be 3 characters")
      .default("bdt"),
    metadata: z.record(z.string()).optional(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, "Payment Intent ID is required"),
    orderId: z.string().uuid("Invalid order ID"),
  }),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
  verifyPaymentSchema,
};
