import { Router } from 'express';
import { UtilityController } from '../controllers/utility.controller';

const router = Router({ mergeParams: true });

router.get('/', UtilityController.getDocuments);
router.post('/', UtilityController.addDocument);
router.delete('/:id', UtilityController.deleteDocument);

export default router;
