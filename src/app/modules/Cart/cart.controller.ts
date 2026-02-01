import { Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { cartService } from './cart.service';

const getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const cart = await cartService.getOrCreateCart(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
    });
});

const addItemToCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const { mealId, quantity } = req.body;

    const cart = await cartService.addItem(userId, mealId, quantity || 1);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
    });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await cartService.updateItemQuantity(userId, itemId, quantity);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cart item updated successfully',
        data: cart,
    });
});

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const { itemId } = req.params;

    const cart = await cartService.removeItem(userId, itemId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
    });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    await cartService.clearCart(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cart cleared successfully',
        data: null,
    });
});

const getCartTotal = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const total = await cartService.calculateCartTotal(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cart total calculated successfully',
        data: { total },
    });
});

export const cartController = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartTotal,
};
