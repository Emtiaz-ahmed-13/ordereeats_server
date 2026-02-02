"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const cart_routes_1 = require("../modules/Cart/cart.routes");
const categories_routes_1 = require("../modules/Categories/categories.routes");
const loyalty_routes_1 = require("../modules/Loyalty/loyalty.routes");
const meals_routes_1 = require("../modules/Meals/meals.routes");
const orders_routes_1 = require("../modules/Orders/orders.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const promoCodes_routes_1 = require("../modules/PromoCodes/promoCodes.routes");
const providers_routes_1 = require("../modules/Providers/providers.routes");
const reviews_routes_1 = require("../modules/Reviews/reviews.routes");
const users_routes_1 = require("../modules/Users/users.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/users", // Admin only usually
        route: users_routes_1.UserRoutes,
    },
    {
        path: "/providers",
        route: providers_routes_1.ProviderRoutes,
    },
    {
        path: "/categories",
        route: categories_routes_1.CategoryRoutes,
    },
    {
        path: "/meals",
        route: meals_routes_1.MealRoutes,
    },
    {
        path: "/orders",
        route: orders_routes_1.OrderRoutes,
    },
    {
        path: "/reviews",
        route: reviews_routes_1.ReviewRoutes,
    },
    {
        path: "/cart",
        route: cart_routes_1.cartRoutes,
    },
    {
        path: "/promo-codes",
        route: promoCodes_routes_1.promoCodeRoutes,
    },
    {
        path: "/loyalty",
        route: loyalty_routes_1.loyaltyRoutes,
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
