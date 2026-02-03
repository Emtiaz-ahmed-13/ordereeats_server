"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const createPaymentIntentSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z
            .number()
            .positive("Amount must be a positive number")
            .int("Amount must be in smallest currency unit"),
        currency: zod_1.z
            .string()
            .length(3, "Currency code must be 3 characters")
            .default("bdt"),
        metadata: zod_1.z.record(zod_1.z.string()).optional(),
    }),
});
const verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentIntentId: zod_1.z.string().min(1, "Payment Intent ID is required"),
        orderId: zod_1.z.string().uuid("Invalid order ID"),
    }),
});
exports.PaymentValidation = {
    createPaymentIntentSchema,
    verifyPaymentSchema,
};
