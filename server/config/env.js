import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopEasy',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  JWT_SECRET: process.env.JWT_SECRET || required('JWT_SECRET'),
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '15m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '7d',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || required('ADMIN_EMAIL'),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || required('ADMIN_PASSWORD'),
  SEED_PRODUCTS: process.env.SEED_PRODUCTS || 'true',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
  CURRENCY: process.env.CURRENCY || 'INR',
  SHIPPING_FEE: Number(process.env.SHIPPING_FEE ?? 49),
  FREE_SHIPPING_THRESHOLD: Number(process.env.FREE_SHIPPING_THRESHOLD ?? 999),
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || '',
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || 'ShopEasy'
};

export const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
