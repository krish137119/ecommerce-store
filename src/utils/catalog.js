const compactNumberFormatter = new Intl.NumberFormat('en-IN');
const compactCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export function formatCompact(value) {
  return compactNumberFormatter.format(Math.round(Number(value) || 0));
}

export function formatCompactCurrency(value) {
  return compactCurrencyFormatter.format(Math.round(Number(value) || 0));
}

function numericId(product) {
  const raw = String(product?.id || '');
  const parsed = Number(raw);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

const BRAND_POOLS = {
  'Mobiles': ['Samsung', 'Xiaomi', 'Realme', 'Vivo', 'OnePlus', 'Apple', 'Motorola', 'Google', 'Nothing', 'Infinix', 'Oppo', 'Poco'],
  'Electronics': ['boAt', 'JBL', 'Sony', 'Noise', 'Zebronics', 'Portronics', 'Logitech', 'Dell'],
  'Fashion': ['Nike', 'Adidas', 'Puma', 'Allen Solly', 'Zara', 'H&M', 'Levis', 'Peter England'],
  'Footwear': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata', 'Liberty', 'Campus', 'Woodland'],
  'Home & Kitchen': ['Prestige', 'Pigeon', 'Borosil', 'Hawkins', 'Milton', 'Butterfly', 'Solimo', 'Wonderchef'],
  'Appliances': ['LG', 'Samsung', 'Whirlpool', 'Havells', 'Voltas', 'IFB', 'Crompton', 'Bajaj'],
  'Beauty & Grooming': ["L'Oreal", 'Maybelline', 'Himalaya', 'Dove', 'Nivea', 'Garnier', 'Mamaearth', 'Lakme'],
  'Sports & Fitness': ['Nike', 'Adidas', 'Decathlon', 'Yonex', 'SG', 'Kookaburra', 'Cosco', 'Nivia'],
  'Toys & Books': ['LEGO', 'Funskool', 'Hamleys', 'Penguin', 'Scholastic', 'Hasbro', 'Mattel', 'Target']
};

const OFFER_POOL = [
  'Special PriceGet extra 10% off (price inclusive of cashback/coupon)',
  'Bank Offer10% off on HDFC Bank Credit Cards',
  'No Cost EMIon Bajaj Finserv, Kotak Mahindra & more',
  'Bank OfferFlat ₹1000 off on ICICI Bank Credit Card',
  'Partner OfferBuy 2 items, save 5% on first item'
];

export function getBrand(product) {
  const pool = BRAND_POOLS[product?.category] || ['Generic'];
  return pool[numericId(product) % pool.length];
}

export function getRating(product) {
  const value = 3.6 + ((Number(product?.popularity) || 50) / 100) * 1.3;
  return Math.min(4.9, Math.max(3.5, Math.round(value * 10) / 10));
}

export function getReviewCount(product) {
  return (numericId(product) * 137) % 9000 + 120;
}

export function getStockCount(product) {
  const stock = Number(product?.stock);
  if (Number.isFinite(stock) && stock >= 0) return stock;
  const id = numericId(product);
  if (id % 23 === 0) return 0;
  if (id % 11 === 0) return 1;
  return 50;
}

export function getStock(product) {
  const count = getStockCount(product);
  if (count <= 0) return 'out';
  if (count < 3) return 'low';
  return 'in';
}

export function getSpecs(product) {
  return [
    `Brand: ${getBrand(product)}`,
    '1 Year Warranty',
    'Country of Origin: India'
  ];
}

export function getOffer(product) {
  return OFFER_POOL[numericId(product) % OFFER_POOL.length];
}

export function getDelivery(product) {
  const price = Number(product?.price) || 0;
  const free = price >= 499;
  return { free, text: free ? 'Free Delivery' : '₹40 Delivery' };
}

export function getDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
