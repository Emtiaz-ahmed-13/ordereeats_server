import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ProviderService } from "./providers.service";

const createProviderProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.user;
    const result = await ProviderService.createProviderProfileInDB({
      ...req.body,
      userId: id,
    });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Provider profile created successfully",
      data: result,
    });
  },
);

const getAllProviders = catchAsync(async (req: Request, res: Response) => {
  const result = await ProviderService.getAllApprovedProvidersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Providers retrieved successfully",
    data: result,
  });
});

const getProviderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProviderService.getProviderByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Provider retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.user;
    const result = await ProviderService.getProviderByUserIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.user;
    const result = await ProviderService.updateProviderProfileInDB(
      id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully (Review in progress)",
      data: result,
    });
  },
);

const getDashboardStats = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.user;
    const result = await ProviderService.getProviderDashboardStatsFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: result,
    });
  },
);

export const ProviderController = {
  createProviderProfile,
  getAllProviders,
  getProviderById,
  getMyProfile,
  updateMyProfile,
  getDashboardStats,
};
