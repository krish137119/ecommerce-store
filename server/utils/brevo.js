import { env } from '../config/env.js';

export function brevoConfigured() {
  return Boolean(env.BREVO_API_KEY && env.BREVO_FROM_EMAIL);
}

async function sendEmail({ to, subject, textContent, htmlContent }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { email: env.BREVO_FROM_EMAIL, name: env.BREVO_FROM_NAME },
      to: [{ email: to }],
      subject,
      textContent,
      htmlContent
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || data.error || 'Failed to send the email.';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function sendOtpEmail(email, code) {
  return sendEmail({
    to: email,
    subject: 'Your one-time login code',
    textContent: `Your one-time login code is ${code}. It expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    htmlContent: `<p>Your one-time login code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p><p>If you didn't request this, you can ignore this email.</p>`
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendOrderConfirmationEmail(order) {
  const itemsRows = order.items
    .map(item => {
      const total = Number(item.price) * Number(item.quantity);
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)} <span style="color:#888;">× ${item.quantity}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">₹${total.toLocaleString('en-IN')}</td>
      </tr>`;
    })
    .join('');
  const shippingLabel = Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toLocaleString('en-IN')}`;
  const name = `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim();

  return sendEmail({
    to: order.shippingInfo.email,
    subject: `Order ${order.orderNumber} received — ${env.BREVO_FROM_NAME}`,
    textContent: `Hi ${name},\n\nThank you for your order ${order.orderNumber}!\n\nTotal: ₹${Number(order.total).toLocaleString('en-IN')}\nStatus: ${order.status}\n\nWe'll email you again when it ships.\n\nThanks,\n${env.BREVO_FROM_NAME}`,
    htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2 style="margin:0 0 4px;">Thank you for your order!</h2>
      <p style="margin:0 0 16px;color:#555;">Hi ${escapeHtml(name)}, your order <strong>${escapeHtml(order.orderNumber)}</strong> has been received.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr><th style="text-align:left;border-bottom:2px solid #333;padding:8px 0;">Item</th><th style="text-align:right;border-bottom:2px solid #333;padding:8px 0;">Price</th></tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
        <tr><td style="padding:4px 0;color:#555;">Subtotal</td><td style="padding:4px 0;text-align:right;">₹${Number(order.subtotal).toLocaleString('en-IN')}</td></tr>
        <tr><td style="padding:4px 0;color:#555;">Shipping</td><td style="padding:4px 0;text-align:right;">${shippingLabel}</td></tr>
        <tr><td style="padding:6px 0;font-weight:bold;font-size:16px;">Total</td><td style="padding:6px 0;text-align:right;font-weight:bold;font-size:16px;">₹${Number(order.total).toLocaleString('en-IN')}</td></tr>
      </table>
      <p style="margin-top:20px;color:#888;font-size:13px;">Status: <strong>${escapeHtml(order.status)}</strong>. We'll email you when your order ships.</p>
      <p style="color:#888;font-size:13px;">Thanks,<br/>${escapeHtml(env.BREVO_FROM_NAME)}</p>
    </div>`
  });
}
