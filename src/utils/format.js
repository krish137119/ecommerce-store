const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatCurrency(amount) {
  return inrFormatter.format(Number(amount) || 0);
}

export function formatPricePaise(paise) {
  return formatCurrency((Number(paise) || 0) / 100);
}

export function discountPercent(price, mrp) {
  const p = Number(price) || 0;
  const m = Number(mrp) || 0;
  if (p <= 0 || m <= p) return 0;
  return Math.round(((m - p) / m) * 100);
}
