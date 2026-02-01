import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { promoCodeService } from './promoCodes.service';

const createPromoCode = async (req: Request, res: Response) => {
    try {
        const promoCode = await promoCodeService.createPromoCode(req.body);

        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Promo code created successfully',
            data: promoCode,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to create promo code',
        });
    }
};

const getAllPromoCodes = async (req: Request, res: Response) => {
    try {
        const promoCodes = await promoCodeService.getAllPromoCodes();

        res.status(httpStatus.OK).json({
            success: true,
            data: promoCodes,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to fetch promo codes',
        });
    }
};

const getActivePromoCodes = async (req: Request, res: Response) => {
    try {
        const promoCodes = await promoCodeService.getActivePromoCodes();

        res.status(httpStatus.OK).json({
            success: true,
            data: promoCodes,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to fetch active promo codes',
        });
    }
};

const validatePromoCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const { orderAmount } = req.body;

        const result = await promoCodeService.validatePromoCode(code, orderAmount);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Promo code is valid',
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Invalid promo code',
        });
    }
};

const updatePromoCode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const promoCode = await promoCodeService.updatePromoCode(id, req.body);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Promo code updated successfully',
            data: promoCode,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to update promo code',
        });
    }
};

const deletePromoCode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await promoCodeService.deletePromoCode(id);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Promo code deleted successfully',
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to delete promo code',
        });
    }
};

export const promoCodeController = {
    createPromoCode,
    getAllPromoCodes,
    getActivePromoCodes,
    validatePromoCode,
    updatePromoCode,
    deletePromoCode,
};
