import { z } from "zod";

const redeemPointsSchema = z.object({
  body: z.object({
    points: z
      .number()
      .positive("Points must be a positive number")
      .int("Points must be an integer"),
  }),
});

export const LoyaltyValidation = {
  redeemPointsSchema,
};
