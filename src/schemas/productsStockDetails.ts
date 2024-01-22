import { z } from "zod";

export const productsStockDetails = z.object({
  code: z.string(),
  stock: z.number(),
  city: z.string(),
  street: z.string(),
  distance: z.number(),
  coverage: z.number(),
});
