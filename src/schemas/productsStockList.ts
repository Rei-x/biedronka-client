import * as z from "zod";

export const productsStockList = z.array(
  z.object({
    code: z.string(),
    stock: z.number(),
    city: z.string(),
    street: z.string(),
    distance: z.number(),
    coverage: z.number(),
  })
);
