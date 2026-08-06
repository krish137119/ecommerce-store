import { Router } from 'express';
import {
  createOrder,
  listMyOrders,
  getOrder,
  listAllOrders,
  updateOrderStatus,
  verifyOrderPayment
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createOrder);
router.post('/:id/verify-payment', requireAuth, verifyOrderPayment);
router.get('/mine', requireAuth, listMyOrders);
router.get('/all', requireAuth, requireAdmin, listAllOrders);
router.get('/:id', requireAuth, getOrder);
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
