import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateUserSchema } from '../validators/user.validator';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/users/me
router.get('/me', UserController.getMe);

// PUT /api/users/me
router.put('/me', validateRequest(updateUserSchema), UserController.updateMe);

// DELETE /api/users/me
router.delete('/me', UserController.deleteMe);

export default router;
