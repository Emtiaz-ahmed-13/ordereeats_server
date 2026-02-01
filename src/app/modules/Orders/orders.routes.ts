import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { OrderController } from "./orders.controller";
import { OrderValidation } from "./orders.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidation.createOrderSchema),
  OrderController.createOrder,
);

router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
  OrderController.getOrders,
);

router.get(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(OrderValidation.getOrderSchema),
  OrderController.getOrderById,
);

router.patch(
  "/:id/status",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusSchema),
  OrderController.updateOrderStatus,
);

export const OrderRoutes = router;
