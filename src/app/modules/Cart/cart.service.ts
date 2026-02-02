import prisma from '../../shared/prisma';

// Shared prisma instance imported

const getOrCreateCart = async (userId: string) => {
    let cart = await prisma.cart.findUnique({
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
        cart = await prisma.cart.create({
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
};

const addItem = async (userId: string, mealId: string, quantity: number) => {
    // Check if meal exists and is available
    const meal = await prisma.meal.findUnique({
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
    const cart = await getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_mealId: {
                cartId: cart.id,
                mealId,
            },
        },
    });

    if (existingItem) {
        // Update quantity
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    } else {
        // Create new item
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                mealId,
                quantity,
            },
        });
    }

    // Return updated cart
    return getOrCreateCart(userId);
};

const updateItemQuantity = async (
    userId: string,
    itemId: string,
    quantity: number
) => {
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const cart = await getOrCreateCart(userId);

    // Verify item belongs to user's cart
    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id,
        },
    });

    if (!item) {
        throw new Error('Cart item not found');
    }

    // Update quantity
    await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
    });

    // Return updated cart
    return getOrCreateCart(userId);
};

const removeItem = async (userId: string, itemId: string) => {
    const cart = await getOrCreateCart(userId);

    // Verify item belongs to user's cart
    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id,
        },
    });

    if (!item) {
        throw new Error('Cart item not found');
    }

    // Delete item
    await prisma.cartItem.delete({
        where: { id: itemId },
    });

    // Return updated cart
    return getOrCreateCart(userId);
};

const clearCart = async (userId: string) => {
    const cart = await getOrCreateCart(userId);

    // Delete all items
    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
    });

    return cart;
};

const calculateCartTotal = async (userId: string) => {
    const cart = await getOrCreateCart(userId);

    let total = 0;
    for (const item of cart.items) {
        total += item.meal.price * item.quantity;
    }

    return total;
};

export const cartService = {
    getOrCreateCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    calculateCartTotal,
};
