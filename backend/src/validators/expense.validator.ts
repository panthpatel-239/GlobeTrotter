import { z } from 'zod';

export const EXPENSE_CATEGORIES = ['transport', 'accommodation', 'activities', 'food', 'other'] as const;

export const createExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: 'Category must be one of: transport, accommodation, activities, food, other' }),
  }),
  description: z.string().min(1, 'Description is required').max(255).trim(),
  amount: z.number().positive('Amount must be greater than 0'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export const updateExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  description: z.string().min(1).max(255).trim().optional(),
  amount: z.number().positive('Amount must be greater than 0').optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
