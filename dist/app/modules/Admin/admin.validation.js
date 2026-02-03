"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateProviderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid provider ID"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum([
            client_1.ProviderStatus.PENDING,
            client_1.ProviderStatus.APPROVED,
            client_1.ProviderStatus.REJECTED,
        ], { message: "Invalid provider status" }),
        rejectionReason: zod_1.z.string().optional(),
    }),
});
const updateUserRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid user ID"),
    }),
    body: zod_1.z.object({
        role: zod_1.z.enum(["CUSTOMER", "PROVIDER", "ADMIN"], {
            message: "Invalid role",
        }),
    }),
});
const generateReportSchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(["REVENUE", "ORDERS", "USERS", "PROVIDERS"], {
            message: "Invalid report type",
        }),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        format: zod_1.z.enum(["PDF", "JSON"]).default("PDF"),
    }),
});
exports.AdminValidation = {
    updateProviderStatusSchema,
    updateUserRoleSchema,
    generateReportSchema,
};
