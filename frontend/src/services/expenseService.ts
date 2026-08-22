import apiClient from './api';
import { Expense } from '../types';
import { ExpenseFormData } from '../utils/validators';
import { mockHandlers } from './mockStorage';

export const expenseService = {
  async getExpenses(tripId: string): Promise<Expense[]> {
    try {
      const response = await apiClient.get<Expense[]>(`/trips/${tripId}/expenses`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, fetching expenses for trip ${tripId} from fallback:`, error);
      return mockHandlers.getExpenses(tripId);
    }
  },

  async addExpense(tripId: string, data: ExpenseFormData): Promise<Expense> {
    try {
      const response = await apiClient.post<Expense>(`/trips/${tripId}/expenses`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, adding expense to trip ${tripId} in fallback:`, error);
      return mockHandlers.addExpense(tripId, data);
    }
  },

  async updateExpense(tripId: string, expenseId: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    try {
      const response = await apiClient.put<Expense>(`/trips/${tripId}/expenses/${expenseId}`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, updating expense ${expenseId} in fallback:`, error);
      return mockHandlers.updateExpense(tripId, expenseId, data);
    }
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<void> {
    try {
      await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
    } catch (error) {
      console.warn(`Backend unavailable, deleting expense ${expenseId} in fallback:`, error);
      mockHandlers.deleteExpense(tripId, expenseId);
    }
  }
};
