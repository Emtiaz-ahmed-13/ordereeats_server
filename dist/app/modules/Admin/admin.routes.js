"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
// ============ Provider Management Routes ============
router.get("/providers/pending", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getPendingProviders);
router.get("/providers", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getAllProviders);
router.patch("/providers/:id/status", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.AdminValidation.updateProviderStatusSchema), admin_controller_1.AdminController.updateProviderStatus);
// ============ User Management Routes ============
router.get("/users", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getAllUsers);
router.patch("/users/:id/role", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.AdminValidation.updateUserRoleSchema), admin_controller_1.AdminController.updateUserRole);
router.patch("/users/:id/deactivate", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.deactivateUser);
// ============ Dashboard Routes ============
router.get("/dashboard/stats", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getDashboardStats);
router.get("/dashboard/activity", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getRecentActivity);
// ============ Report Generation Routes ============
router.get("/reports/generate", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.AdminValidation.generateReportSchema), admin_controller_1.AdminController.generateReport);
exports.AdminRoutes = router;
