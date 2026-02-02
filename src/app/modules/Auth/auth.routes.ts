import express from "express";
import { AuthControllers } from "./auth.controllers";

const router = express.Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.post("/refresh", AuthControllers.refreshToken);
router.post("/verify-email", AuthControllers.verifyEmail);
router.post("/resend-verification", AuthControllers.resendVerification);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;

