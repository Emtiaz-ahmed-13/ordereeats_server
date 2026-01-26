import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TLogin = {
  email: string;
  password: string;
};

const register = async (payload: User) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword
    }
  });

  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
}

const login = async (payload: TLogin) => {
  // find user
  // check whether password correct
  // generate access and refresh token
  // return data
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

  return {
    accessToken,
    refreshToken,
    userWithoutPassword,
  };
};

export const AuthServices = {
  login,
  register
};
