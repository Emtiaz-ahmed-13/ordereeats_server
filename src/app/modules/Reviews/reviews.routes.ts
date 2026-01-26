import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { ReviewController } from "./reviews.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewController.createReview);

export const ReviewRoutes = router;
