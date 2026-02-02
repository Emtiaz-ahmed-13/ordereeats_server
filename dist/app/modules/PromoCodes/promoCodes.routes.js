"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoCodeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const promoCodes_controller_1 = require("./promoCodes.controller");
const router = express_1.default.Router();
// Public - get active promo codes
router.get('/active', promoCodes_controller_1.promoCodeController.getActivePromoCodes);
// Customer - validate promo code
router.post('/:code/validate', (0, auth_1.default)(), promoCodes_controller_1.promoCodeController.validatePromoCode);
// Admin only routes
router.post('/', (0, auth_1.default)('ADMIN'), promoCodes_controller_1.promoCodeController.createPromoCode);
router.get('/', (0, auth_1.default)('ADMIN'), promoCodes_controller_1.promoCodeController.getAllPromoCodes);
router.patch('/:id', (0, auth_1.default)('ADMIN'), promoCodes_controller_1.promoCodeController.updatePromoCode);
router.delete('/:id', (0, auth_1.default)('ADMIN'), promoCodes_controller_1.promoCodeController.deletePromoCode);
exports.promoCodeRoutes = router;
