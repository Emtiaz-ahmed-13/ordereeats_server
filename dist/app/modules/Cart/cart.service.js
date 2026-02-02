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
exports.cartService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
// Shared prisma instance imported
const getOrCreateCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let cart = yield prisma_1.default.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    meal: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            image: true,
                            isAvailable: true,
                        },
                    },
                },
            },
        },
    });
    if (!cart) {
        cart = yield prisma_1.default.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        meal: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                isAvailable: true,
                            },
                        },
                    },
                },
            },
        });
    }
    return cart;
});
const addItem = (userId, mealId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if meal exists and is available
    const meal = yield prisma_1.default.meal.findUnique({
        where: { id: mealId },
    });
    if (!meal) {
        throw new Error('Meal not found');
    }
    if (!meal.isAvailable) {
        throw new Error('Meal is not available');
    }
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }
    // Get or create cart
    const cart = yield getOrCreateCart(userId);
    // Check if item already exists in cart
    const existingItem = yield prisma_1.default.cartItem.findUnique({
        where: {
            cartId_mealId: {
                cartId: cart.id,
                mealId,
            },
        },
    });
    if (existingItem) {
        // Update quantity
        yield prisma_1.default.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    }
    else {
        // Create new item
        yield prisma_1.default.cartItem.create({
            data: {
                cartId: cart.id,
                mealId,
                quantity,
            },
        });
    }
    // Return updated cart
    return getOrCreateCart(userId);
});
const updateItemQuantity = (userId, itemId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }
    const cart = yield getOrCreateCart(userId);
    // Verify item belongs to user's cart
    const item = yield prisma_1.default.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id,
        },
    });
    if (!item) {
        throw new Error('Cart item not found');
    }
    // Update quantity
    yield prisma_1.default.cartItem.update({
        where: { id: itemId },
        data: { quantity },
    });
    // Return updated cart
    return getOrCreateCart(userId);
});
const removeItem = (userId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield getOrCreateCart(userId);
    // Verify item belongs to user's cart
    const item = yield prisma_1.default.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id,
        },
    });
    if (!item) {
        throw new Error('Cart item not found');
    }
    // Delete item
    yield prisma_1.default.cartItem.delete({
        where: { id: itemId },
    });
    // Return updated cart
    return getOrCreateCart(userId);
});
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield getOrCreateCart(userId);
    // Delete all items
    yield prisma_1.default.cartItem.deleteMany({
        where: { cartId: cart.id },
    });
    return cart;
});
const calculateCartTotal = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield getOrCreateCart(userId);
    let total = 0;
    for (const item of cart.items) {
        total += item.meal.price * item.quantity;
    }
    return total;
});
exports.cartService = {
    getOrCreateCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    calculateCartTotal,
};
