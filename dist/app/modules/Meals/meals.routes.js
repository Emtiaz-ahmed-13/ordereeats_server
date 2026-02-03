"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const meals_controller_1 = require("./meals.controller");
const meals_validation_1 = require("./meals.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(meals_validation_1.MealValidation.createMealSchema), meals_controller_1.MealController.createMeal);
router.get("/", meals_controller_1.MealController.getAllMeals);
router.get("/:id", (0, validateRequest_1.default)(meals_validation_1.MealValidation.getMealSchema), meals_controller_1.MealController.getMealById);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(meals_validation_1.MealValidation.updateMealSchema), meals_controller_1.MealController.updateMeal);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(meals_validation_1.MealValidation.getMealSchema), meals_controller_1.MealController.deleteMeal);
exports.MealRoutes = router;
