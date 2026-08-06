import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { razorpayEnabled } from '../utils/razorpay.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    image: { type: String, default: '', maxlength: 1000 }
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, default: '', maxlength: 20 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    zip: { type: String, required: true, trim: true, maxlength: 20 }
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ['razorpay', 'cod', ''], default: '' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    orderNumber: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    shippingInfo: { type: shippingInfoSchema, required: true },
    payment: { type: paymentSchema, default: () => ({}) }
  },
  { timestamps: true, versionKey: false }
);

orderSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    orderNumber: this.orderNumber,
    date: this.createdAt,
    items: this.items,
    subtotal: this.subtotal,
    shipping: this.shipping,
    total: this.total,
    status: this.status,
    shippingInfo: this.shippingInfo,
    payment: {
      method: this.payment.method,
      paid: this.payment.paid,
      paidAt: this.payment.paidAt,
      enabled: razorpayEnabled && Boolean(this.payment.razorpayOrderId),
      keyId: env.RAZORPAY_KEY_ID || '',
      amount: Math.round(this.total * 100),
      orderId: this.payment.razorpayOrderId
    }
  };
};

export const Order = mongoose.model('Order', orderSchema);
