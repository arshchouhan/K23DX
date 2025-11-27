import { Router } from "express";
import { 
  CreateSession, 
  GetSessionsByRole, 
  UpdateSessionStatus,
  GetSessionById 
} from "../controllers/session.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createSessionSchema, updateSessionStatusSchema } from "../utils/zodSchemas.js";

const sessionsRouter = Router();

sessionsRouter.post('/', authenticateToken, validateRequest(createSessionSchema), CreateSession);
sessionsRouter.get('/', authenticateToken, GetSessionsByRole);
sessionsRouter.get('/:id', authenticateToken, GetSessionById);
sessionsRouter.patch('/:id/status', authenticateToken, validateRequest(updateSessionStatusSchema), UpdateSessionStatus);

export default sessionsRouter;
