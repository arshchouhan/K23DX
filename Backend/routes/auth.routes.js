import { Router } from "express";
import { Login, Logout, Register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../utils/zodSchemas.js";

const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), Register);
authRouter.post('/login', validateRequest(loginSchema), Login);
authRouter.post('/logout', Logout);

export default authRouter;


