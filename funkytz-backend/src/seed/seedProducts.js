import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

// Point this at your OLD frontend's `public` folder so we can upload the existing
// product photos (e.g. public/products/panjab-map-black-1.jpg) to Cloudinary.
// Override with: IMAGES_DIR=/path/to/funkytz-website/public node src/seed/seedProducts.js
const IMAGES_DIR = process.env.IMAGES_DIR || path.resolve(process.cwd(), '../funkytz-website/public');

const categories = [
  { id: 'tshirts', name: 'T-Shirts', icon: '👕', order: 1 },
  { id: 'shirts', name: 'Shirts', icon: '🥼', order: 2 },
  { id: 'joggers', name: 'Joggers', icon: '👖', order: 3 },
  { id: 'hoodies', name: 'Hoodies', icon: '🧥', order: 4 },
  { id: 'footwear', name: 'Footwear', icon: '👟', order: 5 },
  { id: 'caps', name: 'Caps', icon: '🧢', order: 6 },
  { id: 'accessories', name: 'Accessories', icon: '🎒', order: 7 },
];

// Local image paths, relative to IMAGES_DIR (i.e. old `public/` folder)
const products = [
  {
    name: 'Panjab Map Premium Tee',
    category: 'tshirts',
    bestseller: true,
    price: 1999,
    haveDiscount: true,
    discountPercentage: 35,
    colors: ['Black', 'Maroon', 'BW'],
    sizes: ['S', 'M', 'L', 'XL'],
    localImages: ['products/panjab-map-black-1.jpg', 'products/panjab-map-bw-2.jpg', 'products/panjab-map-maroon-2.jpg'],
    description: 'A premium t-shirt showcasing the map of Panjab. Features a high quality print and comfortable material for daily wear.',
    trending: true,
    newArrival: true,
  },
  {
    name: 'Boba Tea Tee',
    category: 'tshirts',
    bestseller: false,
    price: 999,
    haveDiscount: false,
    discountPercentage: 0,
    colors: ['White'],
    sizes: ['S', 'M', 'L'],
    localImages: ['products/boba-tee/boba-tee-main.jpeg', 'products/boba-tee/boba-tee-standing-photo.jpeg', 'products/boba-tee/boba-tee-cream.jpg'],
    description: 'Funky boba-tea themed graphic tee.',
    trending: true,
    newArrival: true,
  },
  {
    name: 'Zipper Tee',
    category: 'tshirts',
    bestseller: false,
    price: 1299,
    haveDiscount: false,
    discountPercentage: 0,
    colors: ['White', 'Black', 'Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    localImages: ['products/zipper-tee/zipper-tee-main.jpg', 'products/zipper-tee/zipper-tee-2.jpeg'],
    description: 'Streetwear zipper tee, heavyweight cotton.',
    trending: true,
    newArrival: true,
  },
  {
    name: 'Till Death',
    category: 'tshirts',
    bestseller: false,
    price: 999,
    haveDiscount: false,
    discountPercentage: 0,
    colors: ['Tan', 'Black'],
    sizes: ['M', 'L', 'XL'],
    localImages: ['products/till-death/till-death-tan.jpg'],
    description: 'Vintage-inspired "Till Death" graphic tee.',
    trending: true,
    newArrival: true,
  },
  {
    name: 'Eyes Dont Lie',
    category: 'tshirts',
    bestseller: false,
    price: 999,
    haveDiscount: false,
    discountPercentage: 0,
    colors: ['Red', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    localImages: ['products/eyes-dont-lie/eyes-dont-lie-red.jpg'],
    description: 'Striking graphic tee with captivating eye print.',
    trending: true,
    newArrival: true,
  },
];

async function uploadLocalImage(relativePath) {
  const fullPath = path.join(IMAGES_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ! Image not found, skipping: ${fullPath}`);
    return null;
  }
  const buffer = fs.readFileSync(fullPath);
  return uploadBufferToCloudinary(buffer);
}

async function run() {
  await connectDB();

  console.log('Seeding categories...');
  for (const cat of categories) {
    await Category.updateOne({ id: cat.id }, { $set: cat }, { upsert: true });
  }
  console.log(`  -> ${categories.length} categories ready.`);

  console.log(`Seeding products (reading local images from: ${IMAGES_DIR})...`);
  for (const p of products) {
    const slug = slugify(p.name, { lower: true, strict: true });

    const exists = await Product.findOne({ slug });
    if (exists) {
      console.log(`  - "${p.name}" already exists, skipping.`);
      continue;
    }

    const uploaded = [];
    for (const rel of p.localImages) {
      const result = await uploadLocalImage(rel);
      if (result) uploaded.push(result);
    }

    await Product.create({
      name: p.name,
      slug,
      category: p.category,
      description: p.description,
      price: p.price,
      haveDiscount: p.haveDiscount,
      discountPercentage: p.discountPercentage,
      colors: p.colors,
      sizes: p.sizes,
      images: uploaded,
      bestseller: p.bestseller,
      newArrival: p.newArrival,
      trending: p.trending,
    });
    console.log(`  + Created "${p.name}" with ${uploaded.length} image(s).`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
