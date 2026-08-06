import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';

const keyId = env.RAZORPAY_KEY_ID;
const keySecret = env.RAZORPAY_KEY_SECRET;

export const razorpayEnabled = Boolean(keyId && keySecret);

export const razorpay = razorpayEnabled ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const received = String(signature || '');
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
