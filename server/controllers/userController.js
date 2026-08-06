import { User } from '../models/User.js';
import {
  validateEmail,
  validateName,
  validatePhone,
  isStrongPassword,
  normalizeEmail,
  normalizePhone
} from '../utils/validators.js';

export async function updateProfile(req, res, next) {
  try {
    const user = req.user;
    const { name, email, phone } = req.body || {};

    if (!validateName(name ?? user.name)) {
      return res.status(400).json({ error: 'Name must be 2-60 characters.' });
    }

    const normalizedEmail = email === undefined ? user.email : normalizeEmail(email);
    const normalizedPhone = phone === undefined ? user.phone : normalizePhone(phone);

    if (user.role !== 'admin') {
      if (normalizedEmail && !validateEmail(normalizedEmail)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      if (normalizedEmail) {
        const taken = await User.findOne({ email: normalizedEmail });
        if (taken && taken._id.toString() !== user._id.toString()) {
          return res.status(409).json({ error: 'That email is already in use.' });
        }
      }
      if (normalizedPhone && !validatePhone(normalizedPhone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
      }
      if (normalizedPhone) {
        const taken = await User.findOne({ phone: normalizedPhone });
        if (taken && taken._id.toString() !== user._id.toString()) {
          return res.status(409).json({ error: 'That phone number is already in use.' });
        }
      }
    }

    user.name = name.trim();
    user.email = normalizedEmail || null;
    if (user.role !== 'admin') {
      user.phone = normalizedPhone || null;
    }
    await user.save();
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body || {};
    if (newPassword && newPassword.length > 72) {
      return res.status(400).json({ error: 'Password must be 72 characters or fewer.' });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with upper, lower, number, and special characters.'
      });
    }
    if (!user.passwordless) {
      if (!currentPassword || !(await user.verifyPassword(currentPassword))) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
    }
    await user.setPassword(newPassword);
    await user.save();
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function listCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ customers: customers.map(u => u.toSafeJSON()) });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomerStatus(req, res, next) {
  try {
    const { isActive } = req.body || {};
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    if (target.role === 'admin') {
      return res.status(400).json({ error: 'Admin accounts cannot be managed here.' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be true or false.' });
    }
    target.isActive = isActive;
    if (!isActive) {
      target.refreshTokenHash = '';
    }
    await target.save();
    res.json({ customer: target.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}
