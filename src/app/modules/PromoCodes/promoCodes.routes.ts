import express from 'express';
import auth from '../../middleware/auth';
import { promoCodeController } from './promoCodes.controller';

const router = express.Router();

// Public - get active promo codes
router.get('/active', promoCodeController.getActivePromoCodes);

// Customer - validate promo code
router.post(
    '/:code/validate',
    auth(),
    promoCodeController.validatePromoCode
);

// Admin only routes
router.post(
    '/',
    auth('ADMIN'),
    promoCodeController.createPromoCode
);

router.get(
    '/',
    auth('ADMIN'),
    promoCodeController.getAllPromoCodes
);

router.patch(
    '/:id',
    auth('ADMIN'),
    promoCodeController.updatePromoCode
);

router.delete(
    '/:id',
    auth('ADMIN'),
    promoCodeController.deletePromoCode
);

export const promoCodeRoutes = router;
