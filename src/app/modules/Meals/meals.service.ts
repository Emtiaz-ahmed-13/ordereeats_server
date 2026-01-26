import { Meal, Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

const createMealInDB = async (data: Meal) => {
    const result = await prisma.meal.create({
        data,
    });
    return result;
};

const getAllMealsFromDB = async (filters: any) => {
    const { searchTerm, ...filterData } = filters;
    const andConditions: Prisma.MealWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                }
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })) as Prisma.MealWhereInput[],
        });
    }

    const whereConditions: Prisma.MealWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.meal.findMany({
        where: whereConditions,
        include: {
            category: true,
            provider: true,
        },
    });
    return result;
};

const getMealByIdFromDB = async (id: string) => {
    const result = await prisma.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: true
        }
    });
    return result;
}

const updateMealInDB = async (id: string, payload: Partial<Meal>) => {
    const result = await prisma.meal.update({
        where: { id },
        data: payload
    });
    return result;
}

const deleteMealFromDB = async (id: string) => {
    const result = await prisma.meal.delete({
        where: { id }
    });
    return result;
}

export const MealService = {
    createMealInDB,
    getAllMealsFromDB,
    getMealByIdFromDB,
    updateMealInDB,
    deleteMealFromDB
};
