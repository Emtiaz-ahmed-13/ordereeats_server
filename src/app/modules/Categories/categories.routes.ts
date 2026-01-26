import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { CategoryController } from "./categories.controller";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);

export const CategoryRoutes = router;
