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
exports.LoyaltyService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getLoyaltyPoints = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(401, "User ID is required");
    }
    const result = yield prisma_1.default.loyaltyPoints.findUnique({
        where: { userId },
        include: {
            history: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    if (!result) {
        // Create if not exists (auto-initialize)
        return yield prisma_1.default.loyaltyPoints.create({
            data: { userId },
            include: {
                history: true
            }
        });
    }
    return result;
});
const redeemPoints = (userId, pointsToRedeem) => __awaiter(void 0, void 0, void 0, function* () {
    const loyaltyData = yield prisma_1.default.loyaltyPoints.findUnique({
        where: { userId }
    });
    if (!loyaltyData || loyaltyData.points < pointsToRedeem) {
        throw new ApiError_1.default(400, "Insufficient loyalty points");
    }
    // Points redemption rate from env or constant (e.g., 10 points = 1 BDT)
    const redemptionRate = Number(process.env.POINTS_REDEMPTION_RATE) || 10;
    const discountAmount = pointsToRedeem / redemptionRate;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Deduct points
        const updatedLoyalty = yield tx.loyaltyPoints.update({
            where: { userId },
            data: {
                points: { decrement: pointsToRedeem }
            }
        });
        // Add history
        yield tx.pointsHistory.create({
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
    }));
    return result;
});
exports.LoyaltyService = {
    getLoyaltyPoints,
    redeemPoints
};
