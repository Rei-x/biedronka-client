import { z } from "zod";

export const productsSearch = z.array(
  z.object({ name: z.string(), unit: z.string() })
);
