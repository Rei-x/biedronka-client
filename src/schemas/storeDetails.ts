import { z } from "zod";

export const storeDetails = z.object({
  code: z.string(),
  name: z.string(),
  street: z.string(),
  zip_code: z.string(),
  city: z.string(),
  is_in_refurbishment: z.boolean(),
  close_date: z.null().or(z.string()),
  open_date: z.null().or(z.string()),
  latitude: z.number(),
  longitude: z.number(),
  is_sunday_store: z.boolean(),
  distance: z.null().or(z.number()),
  is_closed_now: z.boolean(),
  target_hour: z.string().or(z.null()),
  opening_hours: z.array(
    z.object({
      opening_time: z.null().or(z.string()),
      closing_time: z.null().or(z.string()),
      date: z.string(),
      store_is_closed: z.boolean(),
    })
  ),
  attributes: z.array(
    z.object({
      store_code: z.string(),
      category: z.string(),
      code: z.string(),
      value: z.string(),
    })
  ),
});
