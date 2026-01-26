import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MealService } from "./meals.service";

const createMeal = catchAsync(async (req: Request, res: Response) => {
    const result = await MealService.createMealInDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Meal created successfully",
        data: result,
    });
});

const getAllMeals = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;
    const result = await MealService.getAllMealsFromDB(filters);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meals retrieved successfully",
        data: result,
    });
});

const getMealById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MealService.getMealByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meal retrieved successfully",
        data: result
    })
})

const updateMeal = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MealService.updateMealInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meal updated successfully",
        data: result
    })
})

const deleteMeal = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MealService.deleteMealFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meal deleted successfully",
        data: result
    })
})

export const MealController = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal
};
