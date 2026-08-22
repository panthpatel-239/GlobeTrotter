import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CreateExpenseInput, UpdateExpenseInput } from '../validators/expense.validator';

export class ExpenseService {
  private static async verifyTripOwner(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, userId: true },
    });

    if (!trip) {
      throw ApiError.notFound('Trip not found');
    }

    if (trip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to access expenses for this trip');
    }

    return trip;
  }

  static async getExpenses(tripId: string, userId: string) {
    await this.verifyTripOwner(tripId, userId);

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }

  static async addExpense(tripId: string, userId: string, input: CreateExpenseInput) {
    await this.verifyTripOwner(tripId, userId);

    const expense = await prisma.expense.create({
      data: {
        tripId,
        category: input.category,
        description: input.description,
        amount: input.amount,
        date: new Date(input.date),
      },
    });

    return expense;
  }

  static async updateExpense(tripId: string, expenseId: string, userId: string, input: UpdateExpenseInput) {
    await this.verifyTripOwner(tripId, userId);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });

    if (!existingExpense) {
      throw ApiError.notFound('Expense not found');
    }

    const dataToUpdate: any = {};
    if (input.category !== undefined) dataToUpdate.category = input.category;
    if (input.description !== undefined) dataToUpdate.description = input.description;
    if (input.amount !== undefined) dataToUpdate.amount = input.amount;
    if (input.date !== undefined) dataToUpdate.date = new Date(input.date);

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: dataToUpdate,
    });

    return updatedExpense;
  }

  static async deleteExpense(tripId: string, expenseId: string, userId: string) {
    await this.verifyTripOwner(tripId, userId);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });

    if (!existingExpense) {
      throw ApiError.notFound('Expense not found');
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return { message: 'Expense deleted successfully' };
  }
}
