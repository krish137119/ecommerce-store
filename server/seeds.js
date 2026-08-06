import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { env } from './config/env.js';
import { products as seedProducts } from '../src/data/products.js';

export async function ensureAdmin() {
  const count = await User.countDocuments({ role: 'admin' });
  if (count > 0) {
    return;
  }
  const admin = new User({ name: env.ADMIN_NAME, email: env.ADMIN_EMAIL, role: 'admin' });
  await admin.setPassword(env.ADMIN_PASSWORD);
  await admin.save();
  console.log('Seeded admin account:', env.ADMIN_EMAIL);
}

export async function seedProductsIfEmpty() {
  if (env.SEED_PRODUCTS === 'false') {
    return;
  }
  const count = await Product.countDocuments();
  if (count > 0) {
    return;
  }
  const docs = seedProducts.map(({ id: _id, ...product }) => product);
  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products.`);
}

export async function ensureProductStock() {
  const products = await Product.find({ stock: { $exists: false } });
  let updated = 0;
  for (const product of products) {
    const hash = parseInt(product._id.toString().slice(-4), 16);
    product.stock = hash % 81;
    await product.save();
    updated += 1;
  }
  if (updated > 0) {
    console.log(`Backfilled stock for ${updated} products.`);
  }
}
