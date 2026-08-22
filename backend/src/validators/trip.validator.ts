import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(1, 'Trip title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  description: z.string().max(2000).optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date format (ISO 8601 string expected)',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date format (ISO 8601 string expected)',
  }),
  coverImage: z.string().url('Cover image must be a valid URL').optional().nullable(),
  budgetLimit: z.number().positive('Budget limit must be greater than 0').optional().nullable(),
  isPublic: z.boolean().optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  }
);

export const updateTripSchema = z.object({
  title: z.string().min(1, 'Trip title cannot be empty').max(200).trim().optional(),
  description: z.string().max(2000).optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date format',
  }).optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date format',
  }).optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional().nullable(),
  budgetLimit: z.number().positive('Budget limit must be greater than 0').optional().nullable(),
  isPublic: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  }
);

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
