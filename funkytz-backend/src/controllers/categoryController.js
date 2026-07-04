import Category from '../models/Category.js';
import Product from '../models/Product.js';

export async function listCategories(req, res) {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json(categories);
}

export async function listCategoriesAdmin(req, res) {
  const categories = await Category.find().sort({ order: 1, createdAt: 1 });
  res.json(categories);
}

export async function createCategory(req, res) {
  const { id, name, icon, order } = req.body;
  if (!id || !name) return res.status(400).json({ message: 'id and name are required' });

  const exists = await Category.findOne({ id });
  if (exists) return res.status(409).json({ message: `Category with id "${id}" already exists` });

  const category = await Category.create({ id, name, icon, order });
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
}

export async function deleteCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const productCount = await Product.countDocuments({ category: category.id, isActive: true });
  if (productCount > 0) {
    return res.status(400).json({
      message: `Cannot delete: ${productCount} active product(s) still use this category. Reassign or remove them first.`,
    });
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
}
