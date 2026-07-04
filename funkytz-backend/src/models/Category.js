import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true }, // e.g. 'tshirts', used as slug
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' }, // emoji or icon name
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
