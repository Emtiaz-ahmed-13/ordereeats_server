"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("./auth.controllers");
const router = express_1.default.Router();
router.post("/register", auth_controllers_1.AuthControllers.register);
router.post("/login", auth_controllers_1.AuthControllers.login);
router.post("/refresh", auth_controllers_1.AuthControllers.refreshToken);
router.post("/verify-email", auth_controllers_1.AuthControllers.verifyEmail);
router.post("/resend-verification", auth_controllers_1.AuthControllers.resendVerification);
router.post("/forgot-password", auth_controllers_1.AuthControllers.forgotPassword);
router.post("/reset-password", auth_controllers_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
