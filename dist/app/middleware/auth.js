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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token)
                throw new ApiError_1.default(401, "You are not authorized");
            // Extract the token from Bearer scheme
            const tokenWithoutBearer = token.split(" ")[1];
            if (!tokenWithoutBearer) {
                throw new ApiError_1.default(401, "Invalid token format");
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(tokenWithoutBearer, config_1.default.jwt.jwt_secret);
            // Normalize user ID consistency (centralized handling for different token versions)
            const userId = verifiedUser.id || verifiedUser.userId || verifiedUser.sub || verifiedUser._id;
            if (userId) {
                verifiedUser.id = userId;
                verifiedUser.userId = userId;
            }
            req.user = verifiedUser;
            const userRoleSource = verifiedUser.role;
            const userRole = userRoleSource === null || userRoleSource === void 0 ? void 0 : userRoleSource.toUpperCase();
            const requiredRoles = roles.map(r => r.toUpperCase());
            console.log('Auth Middleware Trace:', {
                userId: verifiedUser.id,
                originalRole: userRoleSource,
                userRole,
                requiredRoles
            });
            if (requiredRoles.length && !requiredRoles.includes(userRole)) {
                throw new ApiError_1.default(403, `Forbidden: User role '${userRoleSource}' is not authorized for this resource. Required roles: ${roles.join(', ')}`);
            }
            next();
        }
        catch (error) {
            console.error('Auth Middleware Error:', error.message);
            next(error);
        }
    });
};
exports.default = auth;
