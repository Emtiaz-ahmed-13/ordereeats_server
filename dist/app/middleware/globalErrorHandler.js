"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (error, req, res, next) => {
    res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
        error: error,
    });
};
exports.default = globalErrorHandler;
