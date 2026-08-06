import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from '../config/env.js';
import { cookieOptions, signAccessToken, signRefreshToken, hashToken } from '../utils/tokens.js';
import { createOtp, verifyOtp as checkOtp } from '../utils/otp.js';
import { brevoConfigured, sendOtpEmail as sendOtpEmailBrevo } from '../utils/brevo.js';
import {
  validateEmail,
  validateName,
  isStrongPassword,
  normalizeEmail
} from '../utils/validators.js';

async function createSession(res, user) {
  const access = signAccessToken(user._id);
  const refresh = signRefreshToken(user._id);
  const opts = cookieOptions();
  res.cookie('accessToken', access, { ...opts, maxAge: ACCESS_COOKIE_MAX_AGE });
  res.cookie('refreshToken', refresh, { ...opts, maxAge: REFRESH_COOKIE_MAX_AGE });
  user.refreshTokenHash = hashToken(refresh);
  await user.save();
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!validateName(name)) {
      return res.status(400).json({ error: 'Name must be 2-60 characters.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password && password.length > 72) {
      return res.status(400).json({ error: 'Password must be 72 characters or fewer.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with upper, lower, number, and special characters.'
      });
    }
    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    const user = new User({ name: name.trim(), email: normalizedEmail });
    await user.setPassword(password);
    await createSession(res, user);
    res.status(201).json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: normalizeEmail(email || '') });
    const valid = user && user.isActive && (await user.verifyPassword(password));
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    await createSession(res, user);
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await User.updateOne({ refreshTokenHash: hashToken(token) }, { $set: { refreshTokenHash: '' } });
    }
    const opts = cookieOptions();
    res.clearCookie('accessToken', opts);
    res.clearCookie('refreshToken', opts);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.json({ user: null });
    }
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    if (payload.kind !== 'access' || !payload.sub) {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account is unavailable.' });
    }
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    if (payload.kind !== 'refresh' || !payload.sub) {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ error: 'Session expired. Sign in again.' });
    }
    await createSession(res, user);
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

function nameFromEmail(email) {
  const local = (email.split('@')[0] || '').split(/[^a-z0-9]+/i).filter(Boolean);
  const name = local.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return (name || 'Customer').slice(0, 60);
}

export async function requestOtp(req, res, next) {
  try {
    const { email } = req.body || {};
    const normalizedEmail = normalizeEmail(email || '');
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (brevoConfigured()) {
      const code = createOtp(normalizedEmail);
      await sendOtpEmailBrevo(normalizedEmail, code);
    } else {
      const code = createOtp(normalizedEmail);
      if (env.NODE_ENV !== 'production') {
        console.log(`[otp] dev code for ${normalizedEmail}: ${code}`);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    if (Number.isInteger(err.status)) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { email, code } = req.body || {};
    const normalizedEmail = normalizeEmail(email || '');
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const check = checkOtp(normalizedEmail, code);
    if (check.error) {
      return res.status(401).json({ error: check.error });
    }
    const verifiedEmail = normalizedEmail;
    let user = await User.findOne({ email: verifiedEmail });
    if (!user) {
      user = new User({
        name: nameFromEmail(verifiedEmail),
        email: verifiedEmail,
        passwordless: true,
        passwordHash: crypto.randomBytes(32).toString('hex')
      });
      await user.save();
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is disabled.' });
    }
    await createSession(res, user);
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    if (Number.isInteger(err.status)) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}
