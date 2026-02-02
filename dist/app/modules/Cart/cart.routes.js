"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(), cart_controller_1.cartController.getCart);
router.get('/total', (0, auth_1.default)(), cart_controller_1.cartController.getCartTotal);
router.post('/items', (0, auth_1.default)(), cart_controller_1.cartController.addItemToCart);
router.patch('/items/:itemId', (0, auth_1.default)(), cart_controller_1.cartController.updateCartItem);
router.delete('/items/:itemId', (0, auth_1.default)(), cart_controller_1.cartController.removeCartItem);
router.delete('/', (0, auth_1.default)(), cart_controller_1.cartController.clearCart);
exports.cartRoutes = router;
