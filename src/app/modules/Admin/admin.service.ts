import { OrderStatus, ProviderStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const getPendingProvidersFromDB = async () => {
    const result = await prisma.providerProfile.findMany({
        where: {
            status: ProviderStatus.PENDING,
            isOnboarded: true, // Only show those who have completed onboarding info
        },
        include: {
            user: true,
        },
    });
    return result;
};

const updateProviderStatusInDB = async (id: string, status: ProviderStatus) => {
    const result = await prisma.providerProfile.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return result;
};

const getDashboardStatsFromDB = async () => {
    const [totalUsers, activeProviders, pendingProviders, revenueData] = await Promise.all([
        prisma.user.count(),
        prisma.providerProfile.count({
            where: { status: ProviderStatus.APPROVED }
        }),
        prisma.providerProfile.count({
            where: { status: ProviderStatus.PENDING, isOnboarded: true }
        }),
        prisma.order.aggregate({
            where: {
                status: OrderStatus.DELIVERED,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's revenue
                }
            },
            _sum: {
                totalAmount: true
            }
        })
    ]);

    return {
        totalUsers,
        activeProviders,
        pendingProviders,
        dailyRevenue: revenueData._sum.totalAmount || 0,
        systemAlerts: 0, // Placeholder as system alerts aren't implemented yet
    };
};

export const AdminService = {
    getPendingProvidersFromDB,
    updateProviderStatusInDB,
    getDashboardStatsFromDB,
};
