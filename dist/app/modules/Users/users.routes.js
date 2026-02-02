"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const users_controller_1 = require("./users.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controller_1.UserController.getAllUsers);
router.patch("/:id/role", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controller_1.UserController.updateUserRole);
exports.UserRoutes = router;
