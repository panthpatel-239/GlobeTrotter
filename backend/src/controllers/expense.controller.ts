import { Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class ExpenseController {
  static async getExpenses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const expenses = await ExpenseService.getExpenses(tripId, req.user!.id);
      ApiResponse.success(res, expenses);
    } catch (error) {
      next(error);
    }
  }

  static async addExpense(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const expense = await ExpenseService.addExpense(tripId, req.user!.id, req.body);
      ApiResponse.created(res, expense);
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: tripId, expenseId } = req.params;
      const updatedExpense = await ExpenseService.updateExpense(tripId, expenseId, req.user!.id, req.body);
      ApiResponse.success(res, updatedExpense);
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: tripId, expenseId } = req.params;
      const result = await ExpenseService.deleteExpense(tripId, expenseId, req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
