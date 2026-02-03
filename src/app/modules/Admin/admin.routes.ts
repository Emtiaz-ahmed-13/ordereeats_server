import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get(
    "/pending-providers",
    auth(UserRole.ADMIN),
    AdminController.getPendingProviders
);

router.patch(
    "/update-provider-status/:id",
    auth(UserRole.ADMIN),
    AdminController.updateProviderStatus
);

router.get(
    "/dashboard-stats",
    auth(UserRole.ADMIN),
    AdminController.getDashboardStats
);

export const AdminRoutes = router;
