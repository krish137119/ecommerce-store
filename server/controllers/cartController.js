import { Product } from '../models/Product.js';

const MAX_QUANTITY = 99;

function parseQuantity(value) {
  const qty = Number(value);
  return Number.isInteger(qty) && qty >= 1 ? Math.min(qty, MAX_QUANTITY) : null;
}

function parseProductId(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{24}$/i.test(value.trim())) {
    return null;
  }
  return value.trim();
}

async function enrichCart(user) {
  const ids = user.cart.map(item => item.product);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map(product => [product._id.toString(), product]));
  const items = [];
  for (const entry of user.cart) {
    const product = byId.get(String(entry.product));
    if (!product) {
      continue;
    }
    items.push({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      mrp: product.mrp ?? null,
      image: product.image,
      category: product.category,
      stock: product.stock,
      quantity: entry.quantity
    });
  }
  return items;
}

export async function getCart(req, res, next) {
  try {
    res.json({ items: await enrichCart(req.user) });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req, res, next) {
  try {
    const productId = parseProductId(req.body?.product);
    const quantity = parseQuantity(req.body?.quantity);
    if (!productId) {
      return res.status(400).json({ error: 'A valid product id is required.' });
    }
    if (!quantity) {
      return res.status(400).json({ error: 'Quantity must be a whole number between 1 and 99.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    if ((product.stock ?? 0) <= 0) {
      return res.status(400).json({ error: 'This product is currently out of stock.' });
    }
    const user = req.user;
    const existing = user.cart.find(item => String(item.product) === productId);
    const newQuantity = existing ? existing.quantity + quantity : quantity;
    if (newQuantity > (product.stock ?? 0)) {
      return res.status(400).json({ error: `Only ${product.stock} units of "${product.name}" are available.` });
    }
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
    } else {
      user.cart.push({ product: product._id, quantity });
    }
    await user.save();
    res.json({ items: await enrichCart(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const productId = parseProductId(req.params.productId);
    if (!productId) {
      return res.status(400).json({ error: 'A valid product id is required.' });
    }
    const user = req.user;
    const existing = user.cart.find(item => String(item.product) === productId);
    if (!existing) {
      return res.status(404).json({ error: 'Item is not in the cart.' });
    }
    const quantity = parseQuantity(req.body?.quantity);
    if (!quantity) {
      user.cart = user.cart.filter(item => String(item.product) !== productId);
    } else {
      existing.quantity = quantity;
    }
    await user.save();
    res.json({ items: await enrichCart(user) });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const productId = parseProductId(req.params.productId);
    if (!productId) {
      return res.status(400).json({ error: 'A valid product id is required.' });
    }
    req.user.cart = req.user.cart.filter(item => String(item.product) !== productId);
    await req.user.save();
    res.json({ items: await enrichCart(req.user) });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req, res, next) {
  try {
    req.user.cart = [];
    await req.user.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function mergeCart(req, res, next) {
  try {
    const items = req.body?.items;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'An items array is required.' });
    }
    const user = req.user;
    const seen = new Set();
    for (const entry of items) {
      const productId = parseProductId(entry?.product);
      const quantity = parseQuantity(entry?.quantity);
      if (!productId || !quantity || seen.has(productId)) {
        continue;
      }
      seen.add(productId);
      const product = await Product.findById(productId);
      if (!product || (product.stock ?? 0) <= 0) {
        continue;
      }
      const existing = user.cart.find(item => String(item.product) === productId);
      const newQuantity = existing ? existing.quantity + quantity : quantity;
      if (newQuantity > (product.stock ?? 0)) {
        continue;
      }
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      } else {
        user.cart.push({ product: productId, quantity });
      }
    }
    await user.save();
    res.json({ items: await enrichCart(user) });
  } catch (err) {
    next(err);
  }
}
