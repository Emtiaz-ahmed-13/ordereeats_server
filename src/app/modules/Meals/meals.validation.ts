import { z } from "zod";

const createMealSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Meal name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    image: z.string().url("Invalid image URL").optional(),
    isAvailable: z.boolean().default(true),
    categoryId: z.string().uuid("Invalid category ID"),
    providerId: z.string().uuid("Invalid provider ID"),
  }),
});

const updateMealSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    image: z.string().url().optional(),
    isAvailable: z.boolean().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

const getMealSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid meal ID"),
  }),
});

export const MealValidation = {
  createMealSchema,
  updateMealSchema,
  getMealSchema,
};
