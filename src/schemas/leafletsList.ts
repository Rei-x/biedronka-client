import * as z from "zod";

export const leafletsList = z.array(
  z.object({
    id: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    thumbnail: z.string(),
    pages: z.array(
      z.object({
        url: z.string(),
      })
    ),
  })
);
