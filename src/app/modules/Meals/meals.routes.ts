import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { MealController } from "./meals.controller";
import { MealValidation } from "./meals.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(MealValidation.createMealSchema),
  MealController.createMeal,
);

router.get("/", MealController.getAllMeals);

router.get(
  "/:id",
  validateRequest(MealValidation.getMealSchema),
  MealController.getMealById,
);

router.patch(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(MealValidation.updateMealSchema),
  MealController.updateMeal,
);

router.delete(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(MealValidation.getMealSchema),
  MealController.deleteMeal,
);

export const MealRoutes = router;
