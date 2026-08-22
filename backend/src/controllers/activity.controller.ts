import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { ApiResponse } from '../utils/apiResponse';

export class ActivityController {
  static async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activities = await ActivityService.getActivities(req.query as any);
      ApiResponse.success(res, activities);
    } catch (error) {
      next(error);
    }
  }

  static async getActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await ActivityService.getActivityById(req.params.id);
      ApiResponse.success(res, activity);
    } catch (error) {
      next(error);
    }
  }
}
