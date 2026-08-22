import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const tripSchema = z.object({
  title: z.string().min(2, 'Trip title must be at least 2 characters').max(100, 'Title too long'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  coverImage: z.string().optional(),
  budget: z.number().min(0, 'Budget cannot be negative').optional(),
  status: z.enum(['planned', 'ongoing', 'completed', 'draft']),
  destinationSummary: z.string().optional(),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: "End date cannot be earlier than start date",
  path: ["endDate"],
});

export type TripFormData = z.infer<typeof tripSchema>;

export const tripStopSchema = z.object({
  cityName: z.string().min(2, 'City name is required'),
  country: z.string().min(2, 'Country is required'),
  arrivalDate: z.string().min(1, 'Arrival date is required'),
  departureDate: z.string().min(1, 'Departure date is required'),
  notes: z.string().optional(),
  coverImage: z.string().optional(),
}).refine((data) => {
  if (!data.arrivalDate || !data.departureDate) return true;
  return new Date(data.departureDate) >= new Date(data.arrivalDate);
}, {
  message: "Departure date must be after or on arrival date",
  path: ["departureDate"],
});

export type TripStopFormData = z.infer<typeof tripStopSchema>;

export const activitySchema = z.object({
  name: z.string().min(2, 'Activity name is required'),
  category: z.string().min(1, 'Category is required'),
  dayNumber: z.number().min(1, 'Day number must be at least 1'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  cost: z.number().min(0, 'Cost cannot be negative'),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;

export const expenseSchema = z.object({
  title: z.string().min(2, 'Expense title is required'),
  category: z.enum(['transport', 'accommodation', 'activities', 'food', 'shopping', 'other']),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
