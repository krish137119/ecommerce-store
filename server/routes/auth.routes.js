import { Router } from 'express';
import { register, login, logout, me, refresh, requestOtp, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/refresh', refresh);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);

export default router;
