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
exports.ReportService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
// Simple PDF generation helper
const generatePDFContent = (title, data) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #FF6B35; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #FF6B35; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { background-color: #f0f0f0; padding: 10px; margin: 20px 0; border-radius: 5px; }
        .generated { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Report ID:</strong> ${Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>
  `;
    if (Array.isArray(data)) {
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            html += "<table>";
            html += "<tr>" + keys.map((k) => `<th>${k}</th>`).join("") + "</tr>";
            data.forEach((row) => {
                html +=
                    "<tr>" + keys.map((k) => `<td>${row[k]}</td>`).join("") + "</tr>";
            });
            html += "</table>";
        }
    }
    else {
        html += "<div class='summary'>";
        Object.entries(data).forEach(([key, value]) => {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        });
        html += "</div>";
    }
    html += `
      <div class="generated">
        <p>© OrderEats ${new Date().getFullYear()}. Confidential.</p>
      </div>
    </body>
    </html>
  `;
    return html;
};
exports.ReportService = {
    // Generate Revenue Report
    generateRevenueReport: (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();
        const revenueData = yield prisma_1.default.order.aggregate({
            where: {
                status: client_1.OrderStatus.DELIVERED,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: true,
        });
        // Revenue by provider
        const revenueByProvider = yield prisma_1.default.order.groupBy({
            by: ["providerId"],
            where: {
                status: client_1.OrderStatus.DELIVERED,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: true,
        });
        const detailedData = yield Promise.all(revenueByProvider.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const provider = yield prisma_1.default.providerProfile.findUnique({
                where: { id: item.providerId },
                include: { user: true },
            });
            return {
                Provider: (provider === null || provider === void 0 ? void 0 : provider.restaurantName) || "Unknown",
                Revenue: `৳${item._sum.totalAmount || 0}`,
                Orders: item._count,
                Commission: `৳${((item._sum.totalAmount || 0) * 0.15).toFixed(2)}`, // 15% commission
            };
        })));
        const summary = {
            "Total Revenue": `৳${revenueData._sum.totalAmount || 0}`,
            "Total Orders": revenueData._count,
            "Average Order Value": `৳${((revenueData._sum.totalAmount || 0) / revenueData._count).toFixed(2)}`,
            "Platform Commission": `৳${((revenueData._sum.totalAmount || 0) * 0.15).toFixed(2)}`,
            Period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        };
        return {
            summary,
            detailedData,
            htmlContent: generatePDFContent("Revenue Report", detailedData),
        };
    }),
    // Generate Orders Report
    generateOrdersReport: (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();
        const ordersByStatus = yield prisma_1.default.order.groupBy({
            by: ["status"],
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            _count: true,
        });
        const summary = {
            "Total Orders": ordersByStatus.reduce((sum, item) => sum + item._count, 0),
            Delivered: ((_a = ordersByStatus.find((o) => o.status === client_1.OrderStatus.DELIVERED)) === null || _a === void 0 ? void 0 : _a._count) || 0,
            Pending: ((_b = ordersByStatus.find((o) => o.status === client_1.OrderStatus.PENDING)) === null || _b === void 0 ? void 0 : _b._count) || 0,
            Cancelled: ((_c = ordersByStatus.find((o) => o.status === client_1.OrderStatus.CANCELLED)) === null || _c === void 0 ? void 0 : _c._count) || 0,
            Period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        };
        const detailedData = ordersByStatus.map((item) => ({
            Status: item.status,
            Count: item._count,
            Percentage: `${((item._count / summary["Total Orders"]) * 100).toFixed(2)}%`,
        }));
        return {
            summary,
            detailedData,
            htmlContent: generatePDFContent("Orders Report", detailedData),
        };
    }),
    // Generate Users Report
    generateUsersReport: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const usersByRole = yield prisma_1.default.user.groupBy({
            by: ["role"],
            _count: true,
        });
        const totalUsers = usersByRole.reduce((sum, item) => sum + item._count, 0);
        const verifiedEmails = yield prisma_1.default.user.count({
            where: { isEmailVerified: true },
        });
        const summary = {
            "Total Users": totalUsers,
            Customers: ((_a = usersByRole.find((u) => u.role === client_1.UserRole.CUSTOMER)) === null || _a === void 0 ? void 0 : _a._count) || 0,
            Providers: ((_b = usersByRole.find((u) => u.role === client_1.UserRole.PROVIDER)) === null || _b === void 0 ? void 0 : _b._count) || 0,
            Admins: ((_c = usersByRole.find((u) => u.role === client_1.UserRole.ADMIN)) === null || _c === void 0 ? void 0 : _c._count) || 0,
            "Email Verified": verifiedEmails,
            "Verification Rate": `${((verifiedEmails / totalUsers) * 100).toFixed(2)}%`,
        };
        const detailedData = usersByRole.map((item) => ({
            Role: item.role,
            Count: item._count,
            Percentage: `${((item._count / totalUsers) * 100).toFixed(2)}%`,
        }));
        return {
            summary,
            detailedData,
            htmlContent: generatePDFContent("Users Report", detailedData),
        };
    }),
    // Generate Providers Report
    generateProvidersReport: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const providersByStatus = yield prisma_1.default.providerProfile.groupBy({
            by: ["status"],
            _count: true,
        });
        const totalProviders = providersByStatus.reduce((sum, item) => sum + item._count, 0);
        const summary = {
            "Total Providers": totalProviders,
            Approved: ((_a = providersByStatus.find((p) => p.status === client_1.ProviderStatus.APPROVED)) === null || _a === void 0 ? void 0 : _a._count) || 0,
            Pending: ((_b = providersByStatus.find((p) => p.status === client_1.ProviderStatus.PENDING)) === null || _b === void 0 ? void 0 : _b._count) || 0,
            Rejected: ((_c = providersByStatus.find((p) => p.status === client_1.ProviderStatus.REJECTED)) === null || _c === void 0 ? void 0 : _c._count) || 0,
        };
        const providers = yield prisma_1.default.providerProfile.findMany({
            select: {
                restaurantName: true,
                status: true,
                createdAt: true,
                meals: { select: { id: true } },
            },
        });
        const detailedData = providers.map((p) => ({
            Restaurant: p.restaurantName,
            Status: p.status,
            "Meals Listed": p.meals.length,
            Joined: new Date(p.createdAt).toLocaleDateString(),
        }));
        return {
            summary,
            detailedData,
            htmlContent: generatePDFContent("Providers Report", detailedData),
        };
    }),
};
