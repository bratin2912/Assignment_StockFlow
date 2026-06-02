import { z } from 'zod';

export const updateSettingsSchema = z.object({
  defaultLowStockThreshold: z
    .number()
    .int()
    .min(0)
    .optional(),
});