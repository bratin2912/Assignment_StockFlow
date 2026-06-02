import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  sku: z.string().min(1, 'SKU is required'),

  description: z.string().nullable().optional(),

  quantityOnHand: z.union([z.number().int().min(0), z.string().transform(val => parseInt(val, 10))]),

  costPrice: z.union([z.number().optional(), z.string().transform(val => parseFloat(val))]),

  sellingPrice: z.union([z.number().optional(), z.string().transform(val => parseFloat(val))]),

  lowStockThreshold: z.union([z.number().int().optional(), z.string().transform(val => parseInt(val, 10))]),
});

export const updateProductSchema =
  createProductSchema.partial();