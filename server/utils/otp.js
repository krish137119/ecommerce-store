import crypto from 'crypto';

const store = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function createOtp(identifier) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  store.set(identifier, { hash: digest(code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  return code;
}

export function verifyOtp(identifier, code) {
  const entry = store.get(identifier);
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(identifier);
    return { error: 'Code is invalid or has expired.' };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(identifier);
    return { error: 'Too many attempts. Request a new code.' };
  }
  if (digest(String(code || '').trim()) !== entry.hash) {
    entry.attempts += 1;
    return { error: 'Incorrect code.' };
  }
  store.delete(identifier);
  return { ok: true };
}
