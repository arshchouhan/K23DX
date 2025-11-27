import { Router } from "express";
import { GetCurrentUser, UpdateCurrentUser } from "../controllers/user.controller.js";
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from "../middleware/validation.middleware.js";
import { updateUserSchema } from "../utils/zodSchemas.js";

const userRouter = Router();

userRouter.get("/me", authenticateToken, GetCurrentUser);
userRouter.patch('/me', authenticateToken, validateRequest(updateUserSchema), UpdateCurrentUser);

export default userRouter;