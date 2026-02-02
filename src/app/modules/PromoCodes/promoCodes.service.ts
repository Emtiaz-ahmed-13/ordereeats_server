import prisma from '../../shared/prisma';

// Shared prisma instance imported

const createPromoCode = async (data: {
    code: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    validFrom: Date;
    validUntil: Date;
}) => {

    const existing = await prisma.promoCode.findUnique({
        where: { code: data.code.toUpperCase() },
    });

    if (existing) {
        throw new Error('Promo code already exists');
    }

    const promoCode = await prisma.promoCode.create({
        data: {
            ...data,
            code: data.code.toUpperCase(),
        },
    });

    return promoCode;
};

const getAllPromoCodes = async () => {
    return await prisma.promoCode.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

const getActivePromoCodes = async () => {
    const now = new Date();
    return await prisma.promoCode.findMany({
        where: {
            isActive: true,
            validFrom: { lte: now },
            validUntil: { gte: now },
        },
    });
};

const validatePromoCode = async (code: string, orderAmount: number) => {
    const promoCode = await prisma.promoCode.findUnique({
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
        throw new Error(
            `Minimum order amount of ৳${promoCode.minOrderAmount} required`
        );
    }
    let discount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
        discount = (orderAmount * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
            discount = promoCode.maxDiscount;
        }
    } else {
        discount = promoCode.discountValue;
    }

    return {
        promoCode,
        discount: Math.min(discount, orderAmount),
    };
};

const incrementPromoCodeUsage = async (promoCodeId: string) => {
    await prisma.promoCode.update({
        where: { id: promoCodeId },
        data: { usedCount: { increment: 1 } },
    });
};

const updatePromoCode = async (
    id: string,
    data: {
        description?: string;
        discountValue?: number;
        minOrderAmount?: number;
        maxDiscount?: number;
        usageLimit?: number;
        validFrom?: Date;
        validUntil?: Date;
        isActive?: boolean;
    }
) => {
    return await prisma.promoCode.update({
        where: { id },
        data,
    });
};

const deletePromoCode = async (id: string) => {
    return await prisma.promoCode.delete({
        where: { id },
    });
};

export const promoCodeService = {
    createPromoCode,
    getAllPromoCodes,
    getActivePromoCodes,
    validatePromoCode,
    incrementPromoCodeUsage,
    updatePromoCode,
    deletePromoCode,
};
