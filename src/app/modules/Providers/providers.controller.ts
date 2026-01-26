import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ProviderService } from "./providers.service";

const createProviderProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await ProviderService.createProviderProfileInDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Provider profile created successfully",
        data: result,
    });
});

const getAllProviders = catchAsync(async (req: Request, res: Response) => {
    const result = await ProviderService.getAllProvidersFromDB();
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

export const ProviderController = {
    createProviderProfile,
    getAllProviders,
    getProviderById,
};
