"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
router.post("/create-intent", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.createPaymentIntentSchema), payment_controller_1.PaymentController.createPaymentIntent);
exports.PaymentRoutes = router;
