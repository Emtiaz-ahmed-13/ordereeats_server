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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getPendingProvidersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.findMany({
        where: {
            status: client_1.ProviderStatus.PENDING,
            isOnboarded: true, // Only show those who have completed onboarding info
        },
        include: {
            user: true,
        },
    });
    return result;
});
const updateProviderStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerProfile.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return result;
});
exports.AdminService = {
    getPendingProvidersFromDB,
    updateProviderStatusInDB,
};
