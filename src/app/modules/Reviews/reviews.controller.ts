import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./reviews.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const payload = { ...req.body, userId };
    const result = await ReviewService.createReviewInDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

export const ReviewController = {
    createReview,
};
