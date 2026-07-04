import { Router } from 'express';
import {
  listCategories,
  listCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listCategories);
router.get('/admin', requireAuth, listCategoriesAdmin);
router.post('/', requireAuth, createCategory);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

export default router;
