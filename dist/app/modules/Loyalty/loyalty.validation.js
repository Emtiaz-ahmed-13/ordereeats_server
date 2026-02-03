"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyValidation = void 0;
const zod_1 = require("zod");
const redeemPointsSchema = zod_1.z.object({
    body: zod_1.z.object({
        points: zod_1.z
            .number()
            .positive("Points must be a positive number")
            .int("Points must be an integer"),
    }),
});
exports.LoyaltyValidation = {
    redeemPointsSchema,
};
