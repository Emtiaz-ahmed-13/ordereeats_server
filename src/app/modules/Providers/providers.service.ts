import { OrderStatus, ProviderProfile, ProviderStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const createProviderProfileInDB = async (data: ProviderProfile) => {
  const result = await prisma.providerProfile.create({
    data: {
      ...data,
      status: ProviderStatus.PENDING,
    },
  });
  return result;
};

const getAllProvidersFromDB = async () => {
  const result = await prisma.providerProfile.findMany({
    include: {
      user: true,
      meals: true,
    },
  });
  return result;
};

const getAllApprovedProvidersFromDB = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      status: ProviderStatus.APPROVED,
    },
    include: {
      user: true,
      meals: true,
    },
  });
  return result;
};

const getProviderByIdFromDB = async (id: string) => {
  const result = await prisma.providerProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      meals: true,
    },
  });
  return result;
};

const getProviderByUserIdFromDB = async (userId: string) => {
  const result = await prisma.providerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
      meals: true,
    },
  });
  return result;
};

const updateProviderProfileInDB = async (
  userId: string,
  data: Partial<ProviderProfile>,
) => {
  const result = await prisma.providerProfile.update({
    where: {
      userId,
    },
    data: {
      ...data,
      isOnboarded: true, // Automatically mark as onboarded when updated
    },
  });
  return result;
};

const getProviderDashboardStatsFromDB = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    return {
      totalRevenue: 0,
      activeOrders: 0,
      totalCustomers: 0,
      avgRating: 0,
      totalReviews: 0,
    };
  }

  const providerId = provider.id;

  const [revenueData, activeOrdersCount, customersData, reviewsData] =
    await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        where: {
          providerId,
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          totalAmount: true,
        },
      }),
      // Active Orders
      prisma.order.count({
        where: {
          providerId,
          status: {
            in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY],
          },
        },
      }),
      // Total Customers (distinct users)
      prisma.order.groupBy({
        by: ["userId"],
        where: { providerId },
      }),
      // Avg Rating
      prisma.review.aggregate({
        where: { providerId },
        _avg: {
          overallRating: true,
        },
        _count: {
          overallRating: true,
        },
      }),
    ]);

  return {
    totalRevenue: revenueData._sum.totalAmount || 0,
    activeOrders: activeOrdersCount,
    totalCustomers: customersData.length,
    avgRating: reviewsData._avg.overallRating || 0,
    totalReviews: reviewsData._count.overallRating,
  };
};

export const ProviderService = {
  createProviderProfileInDB,
  getAllProvidersFromDB,
  getAllApprovedProvidersFromDB,
  getProviderByIdFromDB,
  getProviderByUserIdFromDB,
  updateProviderProfileInDB,
  getProviderDashboardStatsFromDB,
};
