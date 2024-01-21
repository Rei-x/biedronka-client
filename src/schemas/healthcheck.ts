import { z } from "zod";

export const healthcheck = z.object({ message: z.string() });
