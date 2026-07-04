import slugify from 'slugify';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

function parseArrayField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

async function makeUniqueSlug(name, excludeId = null) {
  const base = slugify(name, { lower: true, strict: true });
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const clash = await Product.findOne(query);
    if (!clash) return slug;
    slug = `${base}-${++counter}`;
  }
}

// GET /api/products (public) - supports ?category=&search=&sort=&bestseller=&newArrival=&sale=&color=&size=&minPrice=&maxPrice=&page=&limit=
export async function listProducts(req, res) {
  const {
    category, search, sort, bestseller, newArrival, sale,
    color, size, minPrice, maxPrice,
    page = 1, limit = 60,
  } = req.query;

  const filter = { isActive: true };
  if (category && category !== 'all') filter.category = category;
  if (bestseller === 'true') filter.bestseller = true;
  if (newArrival === 'true') filter.newArrival = true;
  if (sale === 'true') filter.haveDiscount = true;
  if (color) filter.colors = color;
  if (size) filter.sizes = size;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  let query = Product.find(filter);

  switch (sort) {
    case 'price-low':
      query = query.sort({ price: 1 });
      break;
    case 'price-high':
      query = query.sort({ price: -1 });
      break;
    case 'discount':
      query = query.sort({ discountPercentage: -1 });
      break;
    default:
      query = query.sort({ createdAt: -1 });
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 60));

  const [items, total] = await Promise.all([
    query.skip((pageNum - 1) * limitNum).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
}

// GET /api/products/admin (admin) - includes inactive products too
export async function listProductsAdmin(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/:idOrSlug (public)
export async function getProduct(req, res) {
  const { idOrSlug } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(
    isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
  );
  if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

// POST /api/products (admin) - multipart/form-data with optional "images" files
export async function createProduct(req, res) {
  try {
    const body = req.body;
    if (!body.name || !body.category || body.price === undefined) {
      return res.status(400).json({ message: 'name, category and price are required' });
    }

    const slug = await makeUniqueSlug(body.name);

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((f) => uploadBufferToCloudinary(f.buffer))
      );
      images = uploads;
    }

    const product = await Product.create({
      name: body.name,
      slug,
      category: body.category,
      description: body.description || '',
      price: Number(body.price),
      haveDiscount: body.haveDiscount === 'true' || body.haveDiscount === true,
      discountPercentage: Number(body.discountPercentage) || 0,
      colors: parseArrayField(body.colors),
      sizes: parseArrayField(body.sizes),
      images,
      stock: Number(body.stock) || 0,
      isCustomizable: body.isCustomizable !== 'false',
      bestseller: body.bestseller === 'true' || body.bestseller === true,
      newArrival: body.newArrival === 'true' || body.newArrival === true,
      trending: body.trending === 'true' || body.trending === true,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
}

// PUT /api/products/:id (admin) - can also append new images via "images" files
export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const body = req.body;

    if (body.name && body.name !== product.name) {
      product.slug = await makeUniqueSlug(body.name, product._id);
      product.name = body.name;
    }

    if (body.category !== undefined) product.category = body.category;
    if (body.description !== undefined) product.description = body.description;
    if (body.price !== undefined) product.price = Number(body.price);
    if (body.haveDiscount !== undefined) product.haveDiscount = body.haveDiscount === 'true' || body.haveDiscount === true;
    if (body.discountPercentage !== undefined) product.discountPercentage = Number(body.discountPercentage);
    if (body.colors !== undefined) product.colors = parseArrayField(body.colors);
    if (body.sizes !== undefined) product.sizes = parseArrayField(body.sizes);
    if (body.stock !== undefined) product.stock = Number(body.stock);
    if (body.isCustomizable !== undefined) product.isCustomizable = body.isCustomizable !== 'false';
    if (body.bestseller !== undefined) product.bestseller = body.bestseller === 'true' || body.bestseller === true;
    if (body.newArrival !== undefined) product.newArrival = body.newArrival === 'true' || body.newArrival === true;
    if (body.trending !== undefined) product.trending = body.trending === 'true' || body.trending === true;
    if (body.isActive !== undefined) product.isActive = body.isActive === 'true' || body.isActive === true;

    // Remove specific existing images by publicId (sent as JSON array string "removeImages")
    if (body.removeImages) {
      const toRemove = parseArrayField(body.removeImages);
      const imagesToDelete = product.images.filter((img) => toRemove.includes(img.publicId));
      await Promise.all(imagesToDelete.map((img) => deleteFromCloudinary(img.publicId)));
      product.images = product.images.filter((img) => !toRemove.includes(img.publicId));
    }

    // Append newly uploaded images
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer)));
      product.images.push(...uploads);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
}


