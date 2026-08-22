import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';

const router = Router();

// GET /api/share/:shareId (Public, unauthenticated)
router.get('/:shareId', ShareController.getSharedTrip);

export default router;
