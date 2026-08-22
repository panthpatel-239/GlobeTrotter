import { Router } from 'express';
import { UtilityController } from '../controllers/utility.controller';

const router = Router({ mergeParams: true });

router.get('/', UtilityController.getReservations);
router.post('/', UtilityController.addReservation);
router.put('/:id', UtilityController.updateReservation);
router.delete('/:id', UtilityController.deleteReservation);

export default router;
