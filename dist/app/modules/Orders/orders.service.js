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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createOrderInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = data, orderData = __rest(data, ["items"]);
    const result = yield prisma_1.default.order.create({
        data: Object.assign(Object.assign({}, orderData), { items: {
                create: items
            } }),
        include: {
            items: true
        }
    });
    return result;
});
const getAllOrdersFromDB = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let whereCondition = {};
    if (role === 'CUSTOMER') {
        if (!userId) {
            throw new ApiError_1.default(401, "User ID is required");
        }
        whereCondition.userId = userId;
    }
    else if (role === 'PROVIDER') {
        const provider = yield prisma_1.default.providerProfile.findUnique({
            where: { userId }
        });
        if (provider) {
            whereCondition.providerId = provider.id;
        }
        else {
            return [];
        }
    }
    const result = yield prisma_1.default.order.findMany({
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
});
const getOrderByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
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
});
const updateOrderStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return result;
});
exports.OrderService = {
    createOrderInDB,
    getAllOrdersFromDB,
    getOrderByIdFromDB,
    updateOrderStatusInDB,
};
