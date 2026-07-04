import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

async function resolveProductId(idOrSlug) {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).select('_id');
  return product?._id || null;
}

// GET /api/reviews?product=<idOrSlug> (public) - only visible reviews, plus a rating summary
// If no product is provided, returns latest 10 visible reviews across all products
export async function listReviewsForProduct(req, res) {
  const { product } = req.query;
  
  if (!product) {
    // Return latest 10 store reviews
    const items = await Review.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product', 'name slug images');
      
    return res.json({ items, average: 0, count: items.length });
  }

  const productId = await resolveProductId(product);
  if (!productId) return res.json({ items: [], average: 0, count: 0 });

  const items = await Review.find({ product: productId, isVisible: true }).sort({ createdAt: -1 });
  const count = items.length;
  const average = count ? Math.round((items.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : 0;

  res.json({ items, average, count });
}

// GET /api/reviews/admin (admin) - all reviews across all products, newest first, with product name/slug populated
export async function listReviewsAdmin(req, res) {
  const { product } = req.query;
  const filter = {};
  if (product) {
    const productId = mongoose.isValidObjectId(product) ? product : await resolveProductId(product);
    if (productId) filter.product = productId;
  }
  const items = await Review.find(filter).sort({ createdAt: -1 }).populate('product', 'name slug');
  res.json(items);
}

// POST /api/reviews (admin) - admin manually adds a review for a product
export async function createReview(req, res) {
  const { product, customerName, rating, comment } = req.body;
  if (!product || !customerName || !rating || !comment) {
    return res.status(400).json({ message: 'product, customerName, rating and comment are required' });
  }

  const productDoc = await Product.findById(product);
  if (!productDoc) return res.status(404).json({ message: 'Product not found' });

  const review = await Review.create({
    product,
    customerName,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
  });

  res.status(201).json(review);
}

// PUT /api/reviews/:id (admin) - edit a review, or toggle visibility
export async function updateReview(req, res) {
  const { customerName, rating, comment, isVisible } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (customerName !== undefined) review.customerName = customerName;
  if (rating !== undefined) review.rating = Math.min(5, Math.max(1, Number(rating)));
  if (comment !== undefined) review.comment = comment;
  if (isVisible !== undefined) review.isVisible = isVisible === 'true' || isVisible === true;

  await review.save();
  res.json(review);
}

// DELETE /api/reviews/:id (admin) - reviews admin authored themselves can be removed outright
export async function deleteReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
}
