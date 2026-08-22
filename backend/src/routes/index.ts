import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import tripRoutes from './trip.routes';
import cityRoutes from './city.routes';
import activityRoutes from './activity.routes';
import shareRoutes from './share.routes';
import healthRoutes from './health.routes';
import notificationRoutes from './notification.routes';
import reservationRoutes from './reservation.routes';
import documentRoutes from './document.routes';
import checklistRoutes from './checklist.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/cities', cityRoutes);
router.use('/activities', activityRoutes);
router.use('/share', shareRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reservations', reservationRoutes);
router.use('/documents', documentRoutes);
router.use('/checklist', checklistRoutes);

export default router;
