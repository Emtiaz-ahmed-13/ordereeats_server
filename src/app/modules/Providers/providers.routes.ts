import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { ProviderController } from "./providers.controller";

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.createProviderProfile);
router.get("/", ProviderController.getAllProviders);
router.get("/:id", ProviderController.getProviderById);

export const ProviderRoutes = router;
