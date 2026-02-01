import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { amount, currency, metadata } = req.body;

  const intent = await PaymentService.createPaymentIntent(
    amount,
    currency,
    metadata,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment intent created successfully",
    data: intent,
  });
});

export const PaymentController = {
  createPaymentIntent,
};
