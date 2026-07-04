import { Router } from 'express';
import {
  listReviewsForProduct,
  listReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listReviewsForProduct);
router.get('/admin', requireAuth, listReviewsAdmin);
router.post('/', requireAuth, createReview);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;
