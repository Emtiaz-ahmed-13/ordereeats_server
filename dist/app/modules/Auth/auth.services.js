"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../../config"));
const email_service_1 = require("../../../helpers/email.service");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const userHelpers_1 = require("../../../helpers/userHelpers");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new ApiError_1.default(400, "User with this email already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    // Generate email verification token
    const emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, emailVerificationToken, isEmailVerified: false }),
        });
        if (user.role === client_1.UserRole.PROVIDER) {
            yield tx.providerProfile.create({
                data: {
                    userId: user.id,
                    restaurantName: "Pending Setup",
                    cuisine: "Not specified",
                    deliveryFee: 0,
                    deliveryTime: "Pending",
                    isOnboarded: false,
                },
            });
        }
        if (user.role === client_1.UserRole.CUSTOMER) {
            yield tx.loyaltyPoints.create({
                data: {
                    userId: user.id,
                },
            });
        }
        return user;
    }));
    // Send verification email
    yield email_service_1.emailService.sendVerificationEmail(result.email, result.name, emailVerificationToken);
    const { password: _, emailVerificationToken: __ } = result, userWithoutSensitive = __rest(result, ["password", "emailVerificationToken"]);
    return userWithoutSensitive;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield (0, userHelpers_1.findUserByEmail)(email);
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(401, "Invalid Credentials.");
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userWithoutPassword.id,
        userId: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        name: userWithoutPassword.name,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userWithoutPassword.id,
        userId: userWithoutPassword.id,
        role: userWithoutPassword.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    // Store refresh token in database
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    return {
        accessToken,
        refreshToken,
        userWithoutPassword,
    };
});
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify refresh token
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.default.jwt.refresh_token_secret);
    // Find user with this refresh token
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: decoded.userId,
            refreshToken,
        },
    });
    if (!user) {
        throw new ApiError_1.default(401, "Invalid refresh token");
    }
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    // Generate new access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userWithoutPassword.id,
        userId: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        name: userWithoutPassword.name,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { accessToken: newAccessToken };
});
const verifyEmail = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { emailVerificationToken: token },
    });
    if (!user) {
        throw new ApiError_1.default(400, "Invalid verification token");
    }
    if (user.isEmailVerified) {
        throw new ApiError_1.default(400, "Email already verified");
    }
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            isEmailVerified: true,
            emailVerificationToken: null,
        },
    });
    return { message: "Email verified successfully" };
});
const resendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    if (user.isEmailVerified) {
        throw new ApiError_1.default(400, "Email already verified");
    }
    // Generate new verification token
    const emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { emailVerificationToken },
    });
    // Send verification email
    yield email_service_1.emailService.sendVerificationEmail(user.email, user.name, emailVerificationToken);
    return { message: "Verification email sent" };
});
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        // Don't reveal if user exists for security
        return { message: "If the email exists, a reset link has been sent" };
    }
    // Generate password reset token
    const passwordResetToken = crypto_1.default.randomBytes(32).toString("hex");
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            passwordResetToken,
            passwordResetExpires,
        },
    });
    // Send password reset email
    yield email_service_1.emailService.sendPasswordResetEmail(user.email, user.name, passwordResetToken);
    return { message: "If the email exists, a reset link has been sent" };
});
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new ApiError_1.default(400, "Invalid or expired reset token");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
            refreshToken: null, // Invalidate existing sessions
        },
    });
    return { message: "Password reset successful" };
});
exports.AuthServices = {
    login,
    register,
    refreshAccessToken,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
};
