import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoryRoutes } from "../modules/Categories/categories.routes";
import { MealRoutes } from "../modules/Meals/meals.routes";
import { OrderRoutes } from "../modules/Orders/orders.routes";
import { ProviderRoutes } from "../modules/Providers/providers.routes";
import { ReviewRoutes } from "../modules/Reviews/reviews.routes";
import { UserRoutes } from "../modules/Users/users.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users", // Admin only usually
    route: UserRoutes,
  },
  {
    path: "/providers",
    route: ProviderRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/meals",
    route: MealRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
