"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealValidation = void 0;
const zod_1 = require("zod");
const createMealSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Meal name is required"),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive("Price must be a positive number"),
        image: zod_1.z.string().url("Invalid image URL").optional(),
        isAvailable: zod_1.z.boolean().default(true),
        categoryId: zod_1.z.string().uuid("Invalid category ID"),
        providerId: zod_1.z.string().uuid("Invalid provider ID"),
    }),
});
const updateMealSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        image: zod_1.z.string().url().optional(),
        isAvailable: zod_1.z.boolean().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
const getMealSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid meal ID"),
    }),
});
exports.MealValidation = {
    createMealSchema,
    updateMealSchema,
    getMealSchema,
};
