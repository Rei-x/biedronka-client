import { z } from "zod";

export const storeList = z.array(
  z.object({
    opening_time: z.null().or(z.string()),
    closing_time: z.null().or(z.string()),
    code: z.string(),
    name: z.string(),
    street: z.string(),
    zip_code: z.string(),
    city: z.string(),
    is_in_refurbishment: z.boolean(),
    close_date: z.null().or(z.string()),
    open_date: z.null().or(z.string()),
    distance: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    is_sunday_store: z.boolean(),
    is_closed_now: z.boolean(),
    target_hour: z.null().or(z.string()),
  })
);
