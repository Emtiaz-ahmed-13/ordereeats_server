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
exports.promoCodeService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
// Shared prisma instance imported
const createPromoCode = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if code already exists
    const existing = yield prisma_1.default.promoCode.findUnique({
        where: { code: data.code.toUpperCase() },
    });
    if (existing) {
        throw new Error('Promo code already exists');
    }
    // Create promo code
    const promoCode = yield prisma_1.default.promoCode.create({
        data: Object.assign(Object.assign({}, data), { code: data.code.toUpperCase() }),
    });
    return promoCode;
});
const getAllPromoCodes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.promoCode.findMany({
        orderBy: { createdAt: 'desc' },
    });
});
const getActivePromoCodes = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return yield prisma_1.default.promoCode.findMany({
        where: {
            isActive: true,
            validFrom: { lte: now },
            validUntil: { gte: now },
        },
    });
});
const validatePromoCode = (code, orderAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCode = yield prisma_1.default.promoCode.findUnique({
        where: { code: code.toUpperCase() },
    });
    if (!promoCode) {
        throw new Error('Invalid promo code');
    }
    if (!promoCode.isActive) {
        throw new Error('Promo code is inactive');
    }
    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
        throw new Error('Promo code has expired');
    }
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
        throw new Error('Promo code usage limit reached');
    }
    if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
        throw new Error(`Minimum order amount of ৳${promoCode.minOrderAmount} required`);
    }
    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
        discount = (orderAmount * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
            discount = promoCode.maxDiscount;
        }
    }
    else {
        discount = promoCode.discountValue;
    }
    return {
        promoCode,
        discount: Math.min(discount, orderAmount), // Can't discount more than order amount
    };
});
const incrementPromoCodeUsage = (promoCodeId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.promoCode.update({
        where: { id: promoCodeId },
        data: { usedCount: { increment: 1 } },
    });
});
const updatePromoCode = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.promoCode.update({
        where: { id },
        data,
    });
});
const deletePromoCode = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.promoCode.delete({
        where: { id },
    });
});
exports.promoCodeService = {
    createPromoCode,
    getAllPromoCodes,
    getActivePromoCodes,
    validatePromoCode,
    incrementPromoCodeUsage,
    updatePromoCode,
    deletePromoCode,
};
