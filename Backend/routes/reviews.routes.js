import { Router } from 'express';
import { 
  CreateReviewHandler, 
  GetReviewsHandler,
  GetReviewById 
} from '../controllers/reviews.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { createReviewSchema } from '../utils/zodSchemas.js';

const reviewsRouter = Router();

reviewsRouter.post('/', authenticateToken, validateRequest(createReviewSchema), CreateReviewHandler);
reviewsRouter.get('/', GetReviewsHandler);
reviewsRouter.get('/:id', authenticateToken, GetReviewById);

export default reviewsRouter;
