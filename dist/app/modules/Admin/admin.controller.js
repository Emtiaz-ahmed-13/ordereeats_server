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
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const admin_service_1 = require("./admin.service");
// ============ Provider Management ============
const getPendingProviders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getPendingProvidersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pending providers retrieved successfully",
        data: result,
    });
}));
const updateProviderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const result = yield admin_service_1.AdminService.updateProviderStatusInDB(id, status, rejectionReason);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Provider status updated to ${status}`,
        data: result,
    });
}));
const getAllProviders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = yield admin_service_1.AdminService.getAllProvidersFromDB(page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Providers retrieved successfully",
        data: result.data,
        meta: result.pagination,
    });
}));
// ============ User Management ============
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const result = yield admin_service_1.AdminService.getAllUsersFromDB(page, limit, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.pagination,
    });
}));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    const result = yield admin_service_1.AdminService.updateUserRoleInDB(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User role updated to ${role}`,
        data: result,
    });
}));
const deactivateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.deactivateUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deactivated successfully",
        data: result,
    });
}));
// ============ Dashboard & Stats ============
const getDashboardStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getDashboardStatsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
}));
const getRecentActivity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 20;
    const result = yield admin_service_1.AdminService.getRecentActivityFromDB(limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Recent activity retrieved successfully",
        data: result,
    });
}));
// ============ Report Generation ============
const generateReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, startDate, endDate, format } = req.query;
    const report = yield admin_service_1.AdminService.generateReportFromDB(type, startDate, endDate);
    if (format === "JSON") {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: `${type} report generated successfully`,
            data: {
                summary: report.summary,
                detailedData: report.detailedData,
                generatedAt: new Date(),
            },
        });
    }
    else {
        // Return HTML for PDF conversion
        res.setHeader("Content-Type", "text/html");
        res.send(report.htmlContent);
    }
}));
exports.AdminController = {
    // Provider Management
    getPendingProviders,
    updateProviderStatus,
    getAllProviders,
    // User Management
    getAllUsers,
    updateUserRole,
    deactivateUser,
    // Dashboard
    getDashboardStats,
    getRecentActivity,
    // Reports
    generateReport,
};
