import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { LoyaltyController } from "./loyalty.controller";
import { LoyaltyValidation } from "./loyalty.validation";

const router = express.Router();

router.get("/", auth(UserRole.CUSTOMER), LoyaltyController.getMyLoyaltyInfo);

router.post(
  "/redeem",
  auth(UserRole.CUSTOMER),
  validateRequest(LoyaltyValidation.redeemPointsSchema),
  LoyaltyController.redeemPoints,
);

export const loyaltyRoutes = router;
