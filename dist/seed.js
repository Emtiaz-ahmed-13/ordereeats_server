"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding started...");
        // 1. Create Admin User
        const adminPassword = yield bcrypt_1.default.hash("admin123", 12);
        const admin = yield prisma.user.upsert({
            where: { email: "admin@ordereeats.com" },
            update: {},
            create: {
                email: "admin@ordereeats.com",
                name: "Admin User",
                password: adminPassword,
                role: client_1.UserRole.ADMIN,
                isEmailVerified: true,
            },
        });
        console.log("Admin created");
        // 2. Create Provider User
        const providerPassword = yield bcrypt_1.default.hash("provider123", 12);
        const providerUser = yield prisma.user.upsert({
            where: { email: "provider@ordereeats.com" },
            update: {},
            create: {
                email: "provider@ordereeats.com",
                name: "The Burger House Owner",
                password: providerPassword,
                role: client_1.UserRole.PROVIDER,
                isEmailVerified: true,
            },
        });
        const providerProfile = yield prisma.providerProfile.upsert({
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
        const categories = yield Promise.all(categoriesData.map((cat) => prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        })));
        console.log("Categories created");
        // 4. Create Meals
        const burgerCategory = categories.find((c) => c.name === "Burgers");
        const pizzaCategory = categories.find((c) => c.name === "Pizza");
        yield prisma.meal.deleteMany({});
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
            yield prisma.meal.create({
                data: meal,
            });
        }
        console.log("Meals created");
        // 5. Create Promo Codes
        const promoData = [
            {
                code: "WELCOME50",
                description: "For new users on first order",
                discountType: client_1.DiscountType.PERCENTAGE,
                discountValue: 50,
                minOrderAmount: 300,
                validFrom: new Date(),
                validUntil: new Date("2026-12-31"),
            },
        ];
        for (const promo of promoData) {
            yield prisma.promoCode.upsert({
                where: { code: promo.code },
                update: {},
                create: promo,
            });
        }
        console.log("Promo codes created");
        console.log("Seeding completed successfully!");
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
