import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { LoyaltyService } from "./loyalty.service";

const getMyLoyaltyInfo = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const result = await LoyaltyService.getLoyaltyPoints(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Loyalty information retrieved successfully",
        data: result,
    });
});

const redeemPoints = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.user;
    const { points } = req.body;
    const result = await LoyaltyService.redeemPoints(id, points);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Points redeemed successfully",
        data: result,
    });
});

export const LoyaltyController = {
    getMyLoyaltyInfo,
    redeemPoints
};
