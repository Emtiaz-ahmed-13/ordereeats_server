import { OrderStatus } from "@prisma/client";
import { z } from "zod";

const orderItemSchema = z.object({
  mealId: z.string().uuid("Invalid meal ID"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

const createOrderSchema = z.object({
  body: z.object({
    providerId: z.string().uuid("Invalid provider ID"),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    totalAmount: z.number().positive("Total amount must be positive"),
    deliveryAddress: z.string().min(1, "Delivery address is required"),
    promoCodeId: z.string().uuid().optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.enum(
      [
        OrderStatus.PENDING,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ],
      { message: "Invalid order status" },
    ),
  }),
});

const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
});

export const OrderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderSchema,
};
