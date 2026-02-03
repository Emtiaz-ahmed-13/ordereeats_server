"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    mealId: zod_1.z.string().uuid("Invalid meal ID"),
    quantity: zod_1.z.number().positive("Quantity must be positive"),
    price: zod_1.z.number().positive("Price must be positive"),
});
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        providerId: zod_1.z.string().uuid("Invalid provider ID"),
        items: zod_1.z.array(orderItemSchema).min(1, "At least one item is required"),
        totalAmount: zod_1.z.number().positive("Total amount must be positive"),
        deliveryAddress: zod_1.z.string().min(1, "Delivery address is required"),
        promoCodeId: zod_1.z.string().uuid().optional(),
    }),
});
const updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid order ID"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum([
            client_1.OrderStatus.PENDING,
            client_1.OrderStatus.PREPARING,
            client_1.OrderStatus.READY,
            client_1.OrderStatus.DELIVERED,
            client_1.OrderStatus.CANCELLED,
        ], { message: "Invalid order status" }),
    }),
});
const getOrderSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid order ID"),
    }),
});
exports.OrderValidation = {
    createOrderSchema,
    updateOrderStatusSchema,
    getOrderSchema,
};
