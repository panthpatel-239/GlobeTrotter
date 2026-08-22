import { Router } from 'express';
import { CityController } from '../controllers/city.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { cityQuerySchema } from '../validators/city.validator';

const router = Router();

// GET /api/cities (Query filters: search, country, costIndex)
router.get('/', validateRequest({ query: cityQuerySchema }), CityController.getCities);

// GET /api/cities/:id
router.get('/:id', CityController.getCityById);

export default router;
