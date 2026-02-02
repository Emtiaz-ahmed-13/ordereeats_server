import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

const getLoyaltyPoints = async (userId: string) => {
    if (!userId) {
        throw new ApiError(401, "User ID is required");
    }

    const result = await prisma.loyaltyPoints.findUnique({
        where: { userId },
        include: {
            history: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!result) {
        // Create if not exists (auto-initialize)
        return await prisma.loyaltyPoints.create({
            data: { userId },
            include: {
                history: true
            }
        });
    }

    return result;
};

const redeemPoints = async (userId: string, pointsToRedeem: number) => {
    const loyaltyData = await prisma.loyaltyPoints.findUnique({
        where: { userId }
    });

    if (!loyaltyData || loyaltyData.points < pointsToRedeem) {
        throw new ApiError(400, "Insufficient loyalty points");
    }

    // Points redemption rate from env or constant (e.g., 10 points = 1 BDT)
    const redemptionRate = Number(process.env.POINTS_REDEMPTION_RATE) || 10;
    const discountAmount = pointsToRedeem / redemptionRate;

    const result = await prisma.$transaction(async (tx) => {
        // Deduct points
        const updatedLoyalty = await tx.loyaltyPoints.update({
            where: { userId },
            data: {
                points: { decrement: pointsToRedeem }
            }
        });

        // Add history
        await tx.pointsHistory.create({
            data: {
                loyaltyPointsId: updatedLoyalty.id,
                points: pointsToRedeem,
                type: "REDEEMED",
                description: `Redeemed ${pointsToRedeem} points for ${discountAmount} discount`
            }
        });

        return {
            remainingPoints: updatedLoyalty.points,
            discountAmount
        };
    });

    return result;
};

export const LoyaltyService = {
    getLoyaltyPoints,
    redeemPoints
};
