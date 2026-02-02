import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrderService } from "./orders.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const payload = { ...req.body, userId };

    const result = await OrderService.createOrderInDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order created successfully",
        data: result,
    });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
    const { id, role } = (req as any).user;
    const result = await OrderService.getAllOrdersFromDB(id, role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderService.getOrderByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result
    })
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatusInDB(id, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});

export const OrderController = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
};
