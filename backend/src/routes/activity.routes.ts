import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { activityQuerySchema } from '../validators/activity.validator';

const router = Router();

// GET /api/activities (Query filters: cityId, search, category)
router.get('/', validateRequest({ query: activityQuerySchema }), ActivityController.getActivities);

// GET /api/activities/:id
router.get('/:id', ActivityController.getActivityById);

export default router;
