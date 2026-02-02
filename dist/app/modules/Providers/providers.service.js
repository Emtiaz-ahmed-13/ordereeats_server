"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createProviderProfileInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.create({
        data,
    });
    return result;
});
const getAllProvidersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.findMany({
        include: {
            user: true,
            meals: true,
        },
    });
    return result;
});
const getProviderByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            meals: true,
        },
    });
    return result;
});
const getProviderByUserIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.findUnique({
        where: {
            userId,
        },
        include: {
            user: true,
            meals: true,
        },
    });
    return result;
});
const updateProviderProfileInDB = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.update({
        where: {
            userId,
        },
        data: Object.assign(Object.assign({}, data), { isOnboarded: true // Automatically mark as onboarded when updated
         }),
    });
    return result;
});
const getProviderDashboardStatsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield prisma_1.default.providerProfile.findUnique({
        where: { userId }
    });
    if (!provider) {
        return {
            totalRevenue: 0,
            activeOrders: 0,
            totalCustomers: 0,
            avgRating: 0,
            totalReviews: 0
        };
    }
    const providerId = provider.id;
    const [revenueData, activeOrdersCount, customersData, reviewsData] = yield Promise.all([
        // Total Revenue
        prisma_1.default.order.aggregate({
            where: {
                providerId,
                status: client_1.OrderStatus.DELIVERED
            },
            _sum: {
                totalAmount: true
            }
        }),
        // Active Orders
        prisma_1.default.order.count({
            where: {
                providerId,
                status: {
                    in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.PREPARING, client_1.OrderStatus.READY]
                }
            }
        }),
        // Total Customers (distinct users)
        prisma_1.default.order.groupBy({
            by: ['userId'],
            where: { providerId }
        }),
        // Avg Rating
        prisma_1.default.review.aggregate({
            where: { providerId },
            _avg: {
                overallRating: true
            },
            _count: {
                overallRating: true
            }
        })
    ]);
    return {
        totalRevenue: revenueData._sum.totalAmount || 0,
        activeOrders: activeOrdersCount,
        totalCustomers: customersData.length,
        avgRating: reviewsData._avg.overallRating || 0,
        totalReviews: reviewsData._count.overallRating
    };
});
exports.ProviderService = {
    createProviderProfileInDB,
    getAllProvidersFromDB,
    getProviderByIdFromDB,
    getProviderByUserIdFromDB,
    updateProviderProfileInDB,
    getProviderDashboardStatsFromDB,
};
