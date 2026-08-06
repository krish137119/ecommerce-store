import { Router } from 'express';
import {
  updateProfile,
  changePassword,
  listCustomers,
  updateCustomerStatus
} from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.patch('/me', requireAuth, updateProfile);
router.patch('/me/password', requireAuth, changePassword);
router.get('/customers', requireAuth, requireAdmin, listCustomers);
router.patch('/customers/:id', requireAuth, requireAdmin, updateCustomerStatus);

export default router;
