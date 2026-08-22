import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), AuthController.register);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), AuthController.login);

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
