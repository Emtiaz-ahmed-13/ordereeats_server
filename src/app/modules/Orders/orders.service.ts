import { OrderStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

const createOrderInDB = async (data: any) => {
    const { items, ...orderData } = data;
    const result = await prisma.order.create({
        data: {
            ...orderData,
            items: {
                create: items
            }
        },
        include: {
            items: true
        }
    });
    return result;
};

const getAllOrdersFromDB = async (userId: string, role: string) => {
    let whereCondition: any = {};
    if (role === 'CUSTOMER') {
        if (!userId) {
            throw new ApiError(401, "User ID is required");
        }
        whereCondition.userId = userId;
    } else if (role === 'PROVIDER') {
        const provider = await prisma.providerProfile.findUnique({
            where: { userId }
        });
        if (provider) {
            whereCondition.providerId = provider.id;
        } else {
            return [];
        }
    }
    const result = await prisma.order.findMany({
        where: whereCondition,
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            user: true,
            provider: true
        }
    });
    return result;
};

const getOrderByIdFromDB = async (id: string) => {
    const result = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            user: true,
            provider: true
        }
    });
    return result;
}

const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
    const result = await prisma.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return result;
};

export const OrderService = {
    createOrderInDB,
    getAllOrdersFromDB,
    getOrderByIdFromDB,
    updateOrderStatusInDB,
};
