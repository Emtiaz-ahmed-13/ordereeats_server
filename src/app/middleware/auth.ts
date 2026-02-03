import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) throw new ApiError(401, "You are not authorized");

      // Extract the token from Bearer scheme
      const tokenWithoutBearer = token.split(" ")[1];

      if (!tokenWithoutBearer) {
        throw new ApiError(401, "Invalid token format");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        tokenWithoutBearer,
        config.jwt.jwt_secret as Secret
      ) as any;

      // Normalize user ID consistency (centralized handling for different token versions)
      const userId = verifiedUser.id || verifiedUser.userId || verifiedUser.sub || verifiedUser._id;
      if (userId) {
        verifiedUser.id = userId;
        verifiedUser.userId = userId;
      }

      req.user = verifiedUser;

      const userRoleSource = verifiedUser.role;
      const userRole = userRoleSource?.toUpperCase();
      const requiredRoles = roles.map(r => r.toUpperCase());

      console.log('Auth Middleware Trace:', {
        userId: verifiedUser.id,
        originalRole: userRoleSource,
        userRole,
        requiredRoles
      });

      if (requiredRoles.length && !requiredRoles.includes(userRole)) {
        throw new ApiError(
          403,
          `Forbidden: User role '${userRoleSource}' is not authorized for this resource. Required roles: ${roles.join(', ')}`
        );
      }

      next();
    } catch (error: any) {
      console.error('Auth Middleware Error:', error.message);
      next(error);
    }
  };
};

export default auth;
