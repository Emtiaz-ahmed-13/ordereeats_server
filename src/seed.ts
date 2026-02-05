import { PrismaPg } from "@prisma/adapter-pg";
import { DiscountType, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  // Clean up old data
  console.log("Cleaning up old data...");
  await prisma.meal.deleteMany({});
  await prisma.promoCode.deleteMany({});
  await prisma.providerProfile.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("Old data cleaned up");

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

  // 2. Create Multiple Provider Users
  const providerPassword = await bcrypt.hash("provider123", 12);

  const providersData = [
    {
      email: "burger@ordereeats.com",
      name: "The Burger House Owner",
      restaurantName: "The Burger House",
      cuisine: "American, Burgers",
      deliveryFee: 40,
      deliveryTime: "25-35 min",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    },
    {
      email: "pizza@ordereeats.com",
      name: "Pizza Palace Owner",
      restaurantName: "Pizza Palace",
      cuisine: "Italian, Pizza",
      deliveryFee: 35,
      deliveryTime: "20-30 min",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1537202411406-7fea0b942300?auto=format&fit=crop&q=80&w=800",
    },
    {
      email: "sushi@ordereeats.com",
      name: "Sushi Delight Owner",
      restaurantName: "Sushi Delight",
      cuisine: "Japanese, Asian",
      deliveryFee: 50,
      deliveryTime: "30-40 min",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800",
    },
    {
      email: "chinese@ordereeats.com",
      name: "Dragon Wok Owner",
      restaurantName: "Dragon Wok",
      cuisine: "Chinese, Asian",
      deliveryFee: 30,
      deliveryTime: "25-35 min",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b8d3f590f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const providerProfiles = await Promise.all(
    providersData.map(async (data) => {
      const providerUser = await prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
          email: data.email,
          name: data.name,
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
          restaurantName: data.restaurantName,
          cuisine: data.cuisine,
          deliveryFee: data.deliveryFee,
          deliveryTime: data.deliveryTime,
          rating: data.rating,
          image: data.image,
          status: "APPROVED",
          isOnboarded: true,
        },
      });

      return providerProfile;
    }),
  );
  console.log("Providers created");

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
      }),
    ),
  );
  console.log("Categories created");

  // 4. Create Meals
  const burgerCategory = categories.find((c) => c.name === "Burgers")!;
  const pizzaCategory = categories.find((c) => c.name === "Pizza")!;
  const asianCategory = categories.find((c) => c.name === "Asian")!;
  const dessertsCategory = categories.find((c) => c.name === "Desserts")!;
  const beveragesCategory = categories.find((c) => c.name === "Beverages")!;

  const mealsData = [
    // Burger House Meals
    {
      name: "Chicken Burger Deluxe",
      description:
        "Juicy grilled chicken with fresh vegetables and special sauce",
      price: 450,
      categoryId: burgerCategory.id,
      providerId: providerProfiles[0].id,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Classic Beef Burger",
      description: "Succulent beef patty with pickles, lettuce, and tomato",
      price: 520,
      categoryId: burgerCategory.id,
      providerId: providerProfiles[0].id,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mushroom Swiss Burger",
      description: "Beef patty topped with sautéed mushrooms and Swiss cheese",
      price: 580,
      categoryId: burgerCategory.id,
      providerId: providerProfiles[0].id,
      image:
        "https://images.unsplash.com/photo-1571091613454-1d33bc02de59?auto=format&fit=crop&q=80&w=800",
    },
    // Pizza Palace Meals
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomato, mozzarella, and basil",
      price: 850,
      categoryId: pizzaCategory.id,
      providerId: providerProfiles[1].id,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Pepperoni Supreme",
      description: "Pizza loaded with pepperoni, mozzarella, and Italian herbs",
      price: 950,
      categoryId: pizzaCategory.id,
      providerId: providerProfiles[1].id,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Veggie Garden Pizza",
      description: "Fresh vegetables, mozzarella, and olive oil on crispy base",
      price: 800,
      categoryId: pizzaCategory.id,
      providerId: providerProfiles[1].id,
      image:
        "https://images.unsplash.com/photo-1511689915726-cd4628902d4a?auto=format&fit=crop&q=80&w=800",
    },
    // Sushi Delight Meals
    {
      name: "California Roll",
      description: "Crab, avocado, and cucumber wrapped in premium sushi rice",
      price: 680,
      categoryId: asianCategory.id,
      providerId: providerProfiles[2].id,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Spicy Tuna Roll",
      description:
        "Fresh tuna with spicy mayo and cucumber, perfectly balanced",
      price: 720,
      categoryId: asianCategory.id,
      providerId: providerProfiles[2].id,
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Dragon Roll",
      description: "Eel and avocado topped with shrimp tempura and sauce",
      price: 850,
      categoryId: asianCategory.id,
      providerId: providerProfiles[2].id,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    },
    // Dragon Wok Meals
    {
      name: "Kung Pao Chicken",
      description: "Tender chicken with peanuts, dried chilies, and soy sauce",
      price: 480,
      categoryId: asianCategory.id,
      providerId: providerProfiles[3].id,
      image:
        "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Beef Fried Rice",
      description: "Fragrant fried rice with tender beef and mixed vegetables",
      price: 420,
      categoryId: asianCategory.id,
      providerId: providerProfiles[3].id,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b8d3f590f?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Sweet and Sour Pork",
      description: "Crispy pork in tangy sweet and sour sauce with vegetables",
      price: 520,
      categoryId: asianCategory.id,
      providerId: providerProfiles[3].id,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    },
    // Desserts
    {
      name: "Chocolate Brownies",
      description: "Rich, fudgy chocolate brownies served warm",
      price: 250,
      categoryId: dessertsCategory.id,
      providerId: providerProfiles[0].id,
      image:
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Cheesecake Slice",
      description: "Creamy New York style cheesecake with graham cracker crust",
      price: 320,
      categoryId: dessertsCategory.id,
      providerId: providerProfiles[1].id,
      image:
        "https://images.unsplash.com/photo-1590949776328-3e98d01fb3e1?auto=format&fit=crop&q=80&w=800",
    },
    // Beverages
    {
      name: "Iced Coffee",
      description:
        "Fresh brewed coffee served cold with ice and a touch of cream",
      price: 150,
      categoryId: beveragesCategory.id,
      providerId: providerProfiles[1].id,
      image:
        "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mango Smoothie",
      description: "Creamy mango smoothie with yogurt and fresh fruit",
      price: 180,
      categoryId: beveragesCategory.id,
      providerId: providerProfiles[3].id,
      image:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800",
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
    {
      code: "PIZZA25",
      description: "25% off on pizza orders from Pizza Palace",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 25,
      minOrderAmount: 600,
      validFrom: new Date(),
      validUntil: new Date("2026-12-31"),
    },
    {
      code: "SUSHI100",
      description: "Get ৳100 off on sushi orders above ৳1000",
      discountType: DiscountType.FIXED,
      discountValue: 100,
      minOrderAmount: 1000,
      validFrom: new Date(),
      validUntil: new Date("2026-12-31"),
    },
    {
      code: "HUNGRY500",
      description: "Free delivery on orders above ৳500",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 100,
      minOrderAmount: 500,
      validFrom: new Date(),
      validUntil: new Date("2026-12-31"),
    },
    {
      code: "TREAT20",
      description: "20% off on all orders",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minOrderAmount: 400,
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
