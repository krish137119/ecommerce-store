import { Product } from '../models/Product.js';
import { validateProductInput } from '../utils/validators.js';

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ dateAdded: -1, _id: -1 });
    res.json({ products: products.map(p => p.toSafeJSON()) });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product: product.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const input = {
      name: req.body?.name,
      price: req.body?.price,
      mrp: req.body?.mrp,
      description: req.body?.description || '',
      category: req.body?.category,
      image: req.body?.image,
      images: req.body?.images,
      popularity: req.body?.popularity,
      stock: req.body?.stock,
      dateAdded: req.body?.dateAdded
    };
    const errors = validateProductInput(input);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }
    const product = await Product.create({
      name: input.name.trim(),
      price: Number(input.price),
      mrp: input.mrp === undefined || input.mrp === null || input.mrp === '' ? null : Number(input.mrp),
      category: input.category.trim(),
      image: input.image.trim(),
      images: Array.isArray(input.images) && input.images.length > 0
        ? input.images.map(url => String(url).trim()).filter(Boolean)
        : undefined,
      popularity: input.popularity === undefined ? 50 : Math.round(Number(input.popularity)),
      stock: input.stock === undefined ? 50 : Math.round(Number(input.stock)),
      dateAdded: input.dateAdded || new Date().toISOString().slice(0, 10)
    });
    res.status(201).json({ product: product.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const body = req.body || {};
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const input = {
      name: body.name ?? existing.name,
      price: body.price ?? existing.price,
      mrp: body.mrp !== undefined ? body.mrp : existing.mrp,
      description: body.description ?? existing.description,
      category: body.category ?? existing.category,
      image: body.image ?? existing.image,
      images: body.images !== undefined ? body.images : existing.images,
      popularity: body.popularity ?? existing.popularity,
      stock: body.stock !== undefined ? body.stock : existing.stock
    };
    const errors = validateProductInput(input, { partial: false });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }
    const updates = {
      name: input.name.trim(),
      price: Number(input.price),
      mrp: input.mrp === undefined || input.mrp === null || input.mrp === '' ? null : Number(input.mrp),
      description: input.description.trim(),
      category: input.category.trim(),
      image: input.image.trim(),
      popularity: Math.round(Number(input.popularity)),
      stock: Math.round(Number(input.stock))
    };
    if (body.images !== undefined) {
      updates.images = Array.isArray(body.images) && body.images.length > 0
        ? body.images.map(url => String(url).trim()).filter(Boolean)
        : [existing.image];
    }
    if (body.dateAdded !== undefined) {
      updates.dateAdded = String(body.dateAdded).trim();
    }
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    res.json({ product: product.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
