import { z } from 'zod';

export const createStopSchema = z.object({
  cityId: z.string().min(1, 'cityId is required'),
  arrivalDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid arrivalDate format',
  }),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid departureDate format',
  }),
  order: z.number().int().nonnegative().optional(),
}).refine(
  (data) => {
    return new Date(data.departureDate) >= new Date(data.arrivalDate);
  },
  {
    message: 'departureDate must be on or after arrivalDate',
    path: ['departureDate'],
  }
);

export const updateStopSchema = z.object({
  arrivalDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid arrivalDate format',
  }).optional(),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid departureDate format',
  }).optional(),
  order: z.number().int().nonnegative().optional(),
}).refine(
  (data) => {
    if (data.arrivalDate && data.departureDate) {
      return new Date(data.departureDate) >= new Date(data.arrivalDate);
    }
    return true;
  },
  {
    message: 'departureDate must be on or after arrivalDate',
    path: ['departureDate'],
  }
);

export const createTripActivitySchema = z.object({
  tripStopId: z.string().min(1, 'tripStopId is required'),
  activityId: z.string().min(1, 'activityId is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  startTime: z.string().optional().nullable(),
  cost: z.number().nonnegative('Cost cannot be negative').optional(),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type CreateTripActivityInput = z.infer<typeof createTripActivitySchema>;
