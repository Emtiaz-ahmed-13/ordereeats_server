"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        message,
        error: error,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
