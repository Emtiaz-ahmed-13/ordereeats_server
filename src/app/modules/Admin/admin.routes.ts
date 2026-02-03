import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

// ============ Provider Management Routes ============

router.get(
  "/providers/pending",
  auth(UserRole.ADMIN),
  AdminController.getPendingProviders,
);

router.get("/providers", auth(UserRole.ADMIN), AdminController.getAllProviders);

router.patch(
  "/providers/:id/status",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidation.updateProviderStatusSchema),
  AdminController.updateProviderStatus,
);

// ============ User Management Routes ============

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);

router.patch(
  "/users/:id/role",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidation.updateUserRoleSchema),
  AdminController.updateUserRole,
);

router.patch(
  "/users/:id/deactivate",
  auth(UserRole.ADMIN),
  AdminController.deactivateUser,
);

// ============ Dashboard Routes ============

router.get(
  "/dashboard/stats",
  auth(UserRole.ADMIN),
  AdminController.getDashboardStats,
);

router.get(
  "/dashboard/activity",
  auth(UserRole.ADMIN),
  AdminController.getRecentActivity,
);

// ============ Report Generation Routes ============

router.get(
  "/reports/generate",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidation.generateReportSchema),
  AdminController.generateReport,
);

export const AdminRoutes = router;
