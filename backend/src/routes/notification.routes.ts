import { Router } from 'express';
import { UtilityController } from '../controllers/utility.controller';

const router = Router();

router.get('/', UtilityController.getNotifications);
router.post('/read-all', UtilityController.markAllNotificationsRead);

export default router;
