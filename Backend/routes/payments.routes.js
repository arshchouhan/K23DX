import { Router } from 'express';
import { 
  MakePaymentHandler, 
  GetPaymentHandler,
  UpdatePaymentStatus,
  GetPaymentsBySession 
} from '../controllers/payments.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { createPaymentSchema, updatePaymentStatusSchema } from '../utils/zodSchemas.js';

const paymentsRouter = Router();

paymentsRouter.post('/', authenticateToken, validateRequest(createPaymentSchema), MakePaymentHandler);
paymentsRouter.get('/:id', authenticateToken, GetPaymentHandler);
paymentsRouter.patch('/:id/status', authenticateToken, validateRequest(updatePaymentStatusSchema), UpdatePaymentStatus);
paymentsRouter.get('/session/:sessionId', authenticateToken, GetPaymentsBySession);

export default paymentsRouter;
