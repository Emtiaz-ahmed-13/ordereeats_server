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
exports.cartController = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const cart_service_1 = require("./cart.service");
const getCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const cart = yield cart_service_1.cartService.getOrCreateCart(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
    });
}));
const addItemToCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const { mealId, quantity } = req.body;
    const cart = yield cart_service_1.cartService.addItem(userId, mealId, quantity || 1);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
    });
}));
const updateCartItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = yield cart_service_1.cartService.updateItemQuantity(userId, itemId, quantity);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart item updated successfully',
        data: cart,
    });
}));
const removeCartItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const { itemId } = req.params;
    const cart = yield cart_service_1.cartService.removeItem(userId, itemId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
    });
}));
const clearCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    yield cart_service_1.cartService.clearCart(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart cleared successfully',
        data: null,
    });
}));
const getCartTotal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const total = yield cart_service_1.cartService.calculateCartTotal(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart total calculated successfully',
        data: { total },
    });
}));
exports.cartController = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartTotal,
};
