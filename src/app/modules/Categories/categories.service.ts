import { Category } from "@prisma/client";
import prisma from "../../shared/prisma";

const createCategoryInDB = async (data: Category) => {
    const result = await prisma.category.create({
        data,
    });
    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany({
        include: {
            meals: true,
        },
    });
    return result;
};

export const CategoryService = {
    createCategoryInDB,
    getAllCategoriesFromDB,
};
