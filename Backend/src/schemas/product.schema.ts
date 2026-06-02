import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  sku: z.string().min(1, 'SKU is required'),

  description: z.string().optional(),

  quantityOnHand: z.number().int().min(0),

  costPrice: z.number().optional(),

  sellingPrice: z.number().optional(),

  lowStockThreshold: z.number().int().optional(),
});

export const updateProductSchema =
  createProductSchema.partial();