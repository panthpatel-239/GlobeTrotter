import { z } from 'zod';

export const cityQuerySchema = z.object({
  search: z.string().optional(),
  country: z.string().optional(),
  costIndex: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export type CityQueryInput = z.infer<typeof cityQuerySchema>;
