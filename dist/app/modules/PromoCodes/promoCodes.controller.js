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
exports.promoCodeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const promoCodes_service_1 = require("./promoCodes.service");
const createPromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promoCode = yield promoCodes_service_1.promoCodeService.createPromoCode(req.body);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: 'Promo code created successfully',
            data: promoCode,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to create promo code',
        });
    }
});
const getAllPromoCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promoCodes = yield promoCodes_service_1.promoCodeService.getAllPromoCodes();
        res.status(http_status_1.default.OK).json({
            success: true,
            data: promoCodes,
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to fetch promo codes',
        });
    }
});
const getActivePromoCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promoCodes = yield promoCodes_service_1.promoCodeService.getActivePromoCodes();
        res.status(http_status_1.default.OK).json({
            success: true,
            data: promoCodes,
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to fetch active promo codes',
        });
    }
});
const validatePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        const { orderAmount } = req.body;
        const result = yield promoCodes_service_1.promoCodeService.validatePromoCode(code, orderAmount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Promo code is valid',
            data: result,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Invalid promo code',
        });
    }
});
const updatePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const promoCode = yield promoCodes_service_1.promoCodeService.updatePromoCode(id, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Promo code updated successfully',
            data: promoCode,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to update promo code',
        });
    }
});
const deletePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield promoCodes_service_1.promoCodeService.deletePromoCode(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Promo code deleted successfully',
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: error.message || 'Failed to delete promo code',
        });
    }
});
exports.promoCodeController = {
    createPromoCode,
    getAllPromoCodes,
    getActivePromoCodes,
    validatePromoCode,
    updatePromoCode,
    deletePromoCode,
};
