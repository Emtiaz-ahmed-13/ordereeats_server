import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { MealController } from "./meals.controller";

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER, UserRole.ADMIN), MealController.createMeal);
router.get("/", MealController.getAllMeals);
router.get("/:id", MealController.getMealById);
router.patch("/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), MealController.updateMeal);
router.delete("/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), MealController.deleteMeal);

export const MealRoutes = router;
