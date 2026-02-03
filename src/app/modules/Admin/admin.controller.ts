import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

// ============ Provider Management ============

const getPendingProviders = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPendingProvidersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending providers retrieved successfully",
    data: result,
  });
});

const updateProviderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  const result = await AdminService.updateProviderStatusInDB(
    id,
    status,
    rejectionReason,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Provider status updated to ${status}`,
    data: result,
  });
});

const getAllProviders = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await AdminService.getAllProvidersFromDB(page, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Providers retrieved successfully",
    data: result.data,
    meta: result.pagination,
  });
});

// ============ User Management ============

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const role = req.query.role as string | undefined;

  const result = await AdminService.getAllUsersFromDB(page, limit, role as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.pagination,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await AdminService.updateUserRoleInDB(id, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User role updated to ${role}`,
    data: result,
  });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deactivateUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deactivated successfully",
    data: result,
  });
});

// ============ Dashboard & Stats ============

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStatsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

const getRecentActivity = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await AdminService.getRecentActivityFromDB(limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent activity retrieved successfully",
    data: result,
  });
});

// ============ Report Generation ============

const generateReport = catchAsync(async (req: Request, res: Response) => {
  const { type, startDate, endDate, format } = req.query;

  const report = await AdminService.generateReportFromDB(
    type as any,
    startDate as string,
    endDate as string,
  );

  if (format === "JSON") {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${type} report generated successfully`,
      data: {
        summary: report.summary,
        detailedData: report.detailedData,
        generatedAt: new Date(),
      },
    });
  } else {
    // Return HTML for PDF conversion
    res.setHeader("Content-Type", "text/html");
    res.send(report.htmlContent);
  }
});

export const AdminController = {
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
