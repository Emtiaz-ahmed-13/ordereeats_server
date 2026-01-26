import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { UserController } from "./users.controller";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);
router.patch("/:id/role", auth(UserRole.ADMIN), UserController.updateUserRole);

export const UserRoutes = router;
