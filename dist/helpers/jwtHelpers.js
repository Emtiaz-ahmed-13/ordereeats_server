"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
    return token;
};
const verifyToken = (token, secret) => {
    const tokenWithoutQuotes = token.replace(/^"|"$/g, "");
    const verifiedUser = jsonwebtoken_1.default.verify(tokenWithoutQuotes, secret);
    return verifiedUser;
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
