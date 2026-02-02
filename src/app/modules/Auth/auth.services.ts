import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { emailService } from "../../../helpers/email.service";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TLogin = {
  email: string;
  password: string;
};

const register = async (payload: User) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      emailVerificationToken,
      isEmailVerified: false,
    },
  });

  // Send verification email
  await emailService.sendVerificationEmail(
    result.email,
    result.name,
    emailVerificationToken
  );

  const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = result;
  return userWithoutSensitive;
};

const login = async (payload: TLogin) => {
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  // Store refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    userWithoutPassword,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  // Verify refresh token
  const decoded = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_token_secret as Secret
  );

  // Find user with this refresh token
  const user = await prisma.user.findFirst({
    where: {
      id: decoded.userId,
      refreshToken,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { password: _, ...userWithoutPassword } = user;

  // Generate new access token
  const newAccessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { accessToken: newAccessToken };
};

const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    throw new ApiError(400, "Invalid verification token");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
    },
  });

  return { message: "Email verified successfully" };
};

const resendVerificationEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  // Generate new verification token
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken },
  });

  // Send verification email
  await emailService.sendVerificationEmail(
    user.email,
    user.name,
    emailVerificationToken
  );

  return { message: "Verification email sent" };
};

const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists for security
    return { message: "If the email exists, a reset link has been sent" };
  }

  // Generate password reset token
  const passwordResetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken,
      passwordResetExpires,
    },
  });

  // Send password reset email
  await emailService.sendPasswordResetEmail(
    user.email,
    user.name,
    passwordResetToken
  );

  return { message: "If the email exists, a reset link has been sent" };
};

const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null, // Invalidate existing sessions
    },
  });

  return { message: "Password reset successful" };
};

export const AuthServices = {
  login,
  register,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
};

