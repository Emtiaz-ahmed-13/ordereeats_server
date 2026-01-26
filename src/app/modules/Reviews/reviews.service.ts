import { Review } from "@prisma/client";
import prisma from "../../shared/prisma";

const createReviewInDB = async (data: Review) => {
    const result = await prisma.review.create({
        data,
    });
    return result;
};

const getReviewsForMeal = async (mealId: string) => {
    const result = await prisma.review.findMany({
        where: { mealId },
        include: { user: true }
    });
    return result;
}

export const ReviewService = {
    createReviewInDB,
    getReviewsForMeal
};
