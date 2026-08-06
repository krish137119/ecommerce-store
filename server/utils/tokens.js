import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId.toString(), kind: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL
  });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId.toString(), kind: 'refresh' }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL
  });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    path: '/'
  };
}
