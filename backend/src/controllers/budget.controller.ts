import { Response, NextFunction } from 'express';
import { BudgetService } from '../services/budget.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class BudgetController {
  static async getBudget(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const budget = await BudgetService.getBudgetBreakdown(tripId, req.user!.id);
      ApiResponse.success(res, budget);
    } catch (error) {
      next(error);
    }
  }
}
