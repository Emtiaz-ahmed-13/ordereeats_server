import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { OrderController } from "./orders.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);
router.get("/", auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN), OrderController.getOrders);
router.get("/:id", auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN), OrderController.getOrderById);
router.patch("/:id/status", auth(UserRole.PROVIDER, UserRole.ADMIN), OrderController.updateOrderStatus);

export const OrderRoutes = router;
