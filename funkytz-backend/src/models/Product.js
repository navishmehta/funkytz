import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // cloudinary public_id, needed to delete image later
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true }, // matches Category.id
    description: { type: String, default: '' },

    price: { type: Number, required: true, min: 0 },
    haveDiscount: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0, min: 0, max: 90 },

    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },

    images: { type: [imageSchema], default: [] }, // first image = primary/cover

    stock: { type: Number, default: 0, min: 0 }, // total units available (simple, non-variant stock)
    isCustomizable: { type: Boolean, default: true }, // Funkytz = customize t-shirts brand

    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true }, // soft-delete / hide from storefront
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

// Virtual to compute actual (discounted) price - mirrors old frontend getActualPrice()
productSchema.methods.getActualPrice = function () {
  if (this.haveDiscount && this.discountPercentage) {
    return Math.round(this.price - this.price * (this.discountPercentage / 100));
  }
  return this.price;
};

export default mongoose.model('Product', productSchema);
