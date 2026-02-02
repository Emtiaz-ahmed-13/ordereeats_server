"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const providers_controller_1 = require("./providers.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.PROVIDER, client_1.UserRole.ADMIN), providers_controller_1.ProviderController.createProviderProfile);
router.get("/", providers_controller_1.ProviderController.getAllProviders);
router.get("/:id", providers_controller_1.ProviderController.getProviderById);
exports.ProviderRoutes = router;
