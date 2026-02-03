"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const orders_controller_1 = require("./orders.controller");
const orders_validation_1 = require("./orders.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(orders_validation_1.OrderValidation.createOrderSchema), orders_controller_1.OrderController.createOrder);
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), orders_controller_1.OrderController.getOrders);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(orders_validation_1.OrderValidation.getOrderSchema), orders_controller_1.OrderController.getOrderById);
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(orders_validation_1.OrderValidation.updateOrderStatusSchema), orders_controller_1.OrderController.updateOrderStatus);
exports.OrderRoutes = router;
