import { Router } from 'express';
import {
  listProducts,
  listProductsAdmin,
  getProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', listProducts);
router.get('/admin', requireAuth, listProductsAdmin);
router.get('/:idOrSlug', getProduct);
router.post('/', requireAuth, upload.array('images', 6), createProduct);
router.put('/:id', requireAuth, upload.array('images', 6), updateProduct);

export default router;
