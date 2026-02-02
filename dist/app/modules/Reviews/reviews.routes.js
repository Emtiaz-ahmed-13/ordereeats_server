"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const reviews_controller_1 = require("./reviews.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), reviews_controller_1.ReviewController.createReview);
exports.ReviewRoutes = router;
