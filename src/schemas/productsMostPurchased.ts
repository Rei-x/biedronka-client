import { z } from "zod";

export const productsMostPurchased = z.array(z.object({ name: z.string() }));
