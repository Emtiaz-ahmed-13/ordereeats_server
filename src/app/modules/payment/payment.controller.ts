import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaymentService } from './payment.service';

const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency } = req.body;

        if (!amount) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Amount is required',
            });
            return;
        }

        const intent = await PaymentService.createPaymentIntent(amount, currency);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Payment intent created successfully',
            data: intent,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to create payment intent',
        });
    }
};

export const PaymentController = {
    createPaymentIntent,
};
