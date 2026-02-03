
import { PrismaPg } from '@prisma/adapter-pg';
import { DiscountType, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding started...");

    // 1. Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@ordereeats.com" },
        update: {},
        create: {
            email: "admin@ordereeats.com",
            name: "Admin User",
            password: adminPassword,
            role: UserRole.ADMIN,
            isEmailVerified: true,
        },
    });
    console.log("Admin created");

    // 2. Create Provider User
    const providerPassword = await bcrypt.hash("provider123", 12);
    const providerUser = await prisma.user.upsert({
        where: { email: "provider@ordereeats.com" },
        update: {},
        create: {
            email: "provider@ordereeats.com",
            name: "The Burger House Owner",
            password: providerPassword,
            role: UserRole.PROVIDER,
            isEmailVerified: true,
        },
    });

    const providerProfile = await prisma.providerProfile.upsert({
        where: { userId: providerUser.id },
        update: {},
        create: {
            userId: providerUser.id,
            restaurantName: "The Burger House",
            cuisine: "American, Burgers",
            deliveryFee: 40,
            deliveryTime: "25-35 min",
            rating: 4.8,
        },
    });
    console.log("Provider created");

    // 3. Create Categories
    const categoriesData = [
        { name: "Burgers", image: "🍔" },
        { name: "Pizza", image: "🍕" },
        { name: "Asian", image: "🍜" },
        { name: "Desserts", image: "🍰" },
        { name: "Beverages", image: "☕" },
    ];

    const categories = await Promise.all(
        categoriesData.map((cat) =>
            prisma.category.upsert({
                where: { name: cat.name },
                update: {},
                create: cat,
            })
        )
    );
    console.log("Categories created");

    // 4. Create Meals
    const burgerCategory = categories.find((c) => c.name === "Burgers")!;
    const pizzaCategory = categories.find((c) => c.name === "Pizza")!;

    await prisma.meal.deleteMany({});

    const mealsData = [
        {
            name: "Chicken Burger Deluxe",
            description: "Juicy grilled chicken with fresh vegetables and special sauce",
            price: 450,
            categoryId: burgerCategory.id,
            providerId: providerProfile.id,
            image: "http://localhost:5001/uploads/burger.jpg",
        },
        {
            name: "Margherita Pizza",
            description: "Classic Italian pizza with tomato, mozzarella, and basil",
            price: 850,
            categoryId: pizzaCategory.id,
            providerId: providerProfile.id,
            image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800",
        },
    ];

    for (const meal of mealsData) {
        await prisma.meal.create({
            data: meal,
        });
    }
    console.log("Meals created");

    // 5. Create Promo Codes
    const promoData = [
        {
            code: "WELCOME50",
            description: "For new users on first order",
            discountType: DiscountType.PERCENTAGE,
            discountValue: 50,
            minOrderAmount: 300,
            validFrom: new Date(),
            validUntil: new Date("2026-12-31"),
        },
    ];

    for (const promo of promoData) {
        await prisma.promoCode.upsert({
            where: { code: promo.code },
            update: {},
            create: promo,
        });
    }
    console.log("Promo codes created");

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
