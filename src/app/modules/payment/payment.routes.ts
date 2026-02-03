import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
  "/create-intent",
  auth(UserRole.CUSTOMER),
  validateRequest(PaymentValidation.createPaymentIntentSchema),
  PaymentController.createPaymentIntent,
);

export const PaymentRoutes = router;
