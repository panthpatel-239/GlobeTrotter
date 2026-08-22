import { Request, Response, NextFunction } from 'express';
import { CityService } from '../services/city.service';
import { ApiResponse } from '../utils/apiResponse';

export class CityController {
  static async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cities = await CityService.getAllCities(req.query as any);
      ApiResponse.success(res, cities);
    } catch (error) {
      next(error);
    }
  }

  static async getCityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const city = await CityService.getCityById(req.params.id);
      ApiResponse.success(res, city);
    } catch (error) {
      next(error);
    }
  }
}
