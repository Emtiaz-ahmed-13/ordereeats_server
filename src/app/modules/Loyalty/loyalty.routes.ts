import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { LoyaltyController } from "./loyalty.controller";

const router = express.Router();

router.get("/", auth(UserRole.CUSTOMER), LoyaltyController.getMyLoyaltyInfo);
router.post("/redeem", auth(UserRole.CUSTOMER), LoyaltyController.redeemPoints);

export const loyaltyRoutes = router;
