import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { BudgetBreakdown } from '../types';

export class BudgetService {
  static async getBudgetBreakdown(tripId: string, userId: string): Promise<BudgetBreakdown> {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        expenses: true,
      },
    });

    if (!trip) {
      throw ApiError.notFound('Trip not found');
    }

    if (trip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to view this trip budget');
    }

    const categories = {
      transport: 0,
      accommodation: 0,
      activities: 0,
      food: 0,
      other: 0,
    };

    let total = 0;

    for (const exp of trip.expenses) {
      const cat = exp.category.toLowerCase() as keyof typeof categories;
      if (categories[cat] !== undefined) {
        categories[cat] += exp.amount;
      } else {
        categories.other += exp.amount;
      }
      total += exp.amount;
    }

    const budgetLimit = trip.budgetLimit;
    const remaining = budgetLimit !== null ? budgetLimit - total : null;
    const isOverBudget = budgetLimit !== null ? total > budgetLimit : false;

    return {
      total,
      budgetLimit,
      remaining,
      isOverBudget,
      expenseCount: trip.expenses.length,
      categories,
    };
  }
}
