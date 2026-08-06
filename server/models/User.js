import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, trim: true, lowercase: true, default: null, maxlength: 254 },
    phone: { type: String, trim: true, default: null, maxlength: 20 },
    passwordHash: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    passwordless: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshTokenHash: { type: String, default: '' },
    cart: { type: [cartItemSchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, {
  unique: true,
  partialFilterExpression: { email: { $type: 'string' } }
});
userSchema.index({ phone: 1 }, {
  unique: true,
  partialFilterExpression: { phone: { $type: 'string' } }
});

userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, SALT_ROUNDS);
  this.passwordless = false;
};

userSchema.methods.verifyPassword = function verifyPassword(plain) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(String(plain), this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email || '',
    phone: this.phone || '',
    role: this.role,
    passwordless: this.passwordless,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

export const User = mongoose.model('User', userSchema);
