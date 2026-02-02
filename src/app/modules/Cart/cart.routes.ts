import express from 'express';
import auth from '../../middleware/auth';
import { cartController } from './cart.controller';

const router = express.Router();

router.get('/', auth(), cartController.getCart);

router.get('/total', auth(), cartController.getCartTotal);


router.post('/items', auth(), cartController.addItemToCart);

router.patch('/items/:itemId', auth(), cartController.updateCartItem);

router.delete('/items/:itemId', auth(), cartController.removeCartItem);


router.delete('/', auth(), cartController.clearCart);

export const cartRoutes = router;
