import { z } from 'zod';

export const createStopSchema = z.object({
  cityId: z.string().optional(),
  cityName: z.string().optional(),
  country: z.string().optional(),
  coverImage: z.string().optional(),
  notes: z.string().optional(),
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
).refine(
  (data) => {
    return !!data.cityId || !!data.cityName;
  },
  {
    message: 'Either cityId or cityName is required',
    path: ['cityName'],
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
  notes: z.string().optional(),
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
  activityId: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  startTime: z.string().optional().nullable(),
  cost: z.number().nonnegative('Cost cannot be negative').optional(),
  dayNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type CreateTripActivityInput = z.infer<typeof createTripActivitySchema>;
