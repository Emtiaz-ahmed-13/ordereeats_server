import { ProviderStatus } from "@prisma/client";
import { z } from "zod";

const updateProviderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid provider ID"),
  }),
  body: z.object({
    status: z.enum(
      [
        ProviderStatus.PENDING,
        ProviderStatus.APPROVED,
        ProviderStatus.REJECTED,
      ],
      { message: "Invalid provider status" },
    ),
    rejectionReason: z.string().optional(),
  }),
});

const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"], {
      message: "Invalid role",
    }),
  }),
});

const generateReportSchema = z.object({
  query: z.object({
    type: z.enum(["REVENUE", "ORDERS", "USERS", "PROVIDERS"], {
      message: "Invalid report type",
    }),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    format: z.enum(["PDF", "JSON"]).default("PDF"),
  }),
});

export const AdminValidation = {
  updateProviderStatusSchema,
  updateUserRoleSchema,
  generateReportSchema,
};
