import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

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
    const { status } = req.body;
    const result = await AdminService.updateProviderStatusInDB(id, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Provider status updated to ${status}`,
        data: result,
    });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStatsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
});

export const AdminController = {
    getPendingProviders,
    updateProviderStatus,
    getDashboardStats,
};
