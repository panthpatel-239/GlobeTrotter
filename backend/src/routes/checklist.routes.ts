import { Router } from 'express';
import { UtilityController } from '../controllers/utility.controller';

const router = Router({ mergeParams: true });

router.get('/', UtilityController.getChecklist);
router.post('/', UtilityController.addChecklistItem);
router.patch('/:id/toggle', UtilityController.toggleChecklistItem);
router.delete('/:id', UtilityController.deleteChecklistItem);

export default router;
