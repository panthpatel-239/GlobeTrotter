import { z } from 'zod';

export const activityQuerySchema = z.object({
  cityId: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});

export type ActivityQueryInput = z.infer<typeof activityQuerySchema>;
