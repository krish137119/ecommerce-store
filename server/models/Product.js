import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: null, min: 0 },
    description: { type: String, default: '', maxlength: 2000 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    image: { type: String, required: true, trim: true, maxlength: 1000 },
    images: {
      type: [String],
      validate: {
        validator: value => !value || value.every(url => typeof url === 'string' && url.trim().length <= 1000),
        message: 'Each image URL must be 1000 characters or fewer.'
      }
    },
    popularity: { type: Number, default: 50, min: 0, max: 100 },
    stock: { type: Number, default: 50, min: 0, max: 9999 },
    dateAdded: { type: String, default: () => new Date().toISOString().slice(0, 10) }
  },
  { versionKey: false }
);

productSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    price: this.price,
    mrp: this.mrp,
    description: this.description,
    category: this.category,
    image: this.image,
    images: this.images && this.images.length ? this.images : [this.image],
    popularity: this.popularity,
    stock: this.stock,
    dateAdded: this.dateAdded
  };
};

export const Product = mongoose.model('Product', productSchema);
