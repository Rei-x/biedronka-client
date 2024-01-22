import { z } from "zod";

export const usersMe = z.object({
  card_number: z.string(),
  phone_number: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_blik_payment_active: z.boolean(),
  is_show_tobacco: z.boolean(),
  consents: z.object({
    tobacco_marketing_consent: z.null().or(z.boolean()),
    phone_number_pos_authorization_consent: z.null().or(z.boolean()),
  }),
  wallets: z.array(
    z.object({ perspectiv_id: z.string(), balance: z.number() })
  ),
  store: z.object({
    code: z.string(),
    name: z.string(),
    street: z.string(),
    zip_code: z.string(),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    opening_hours: z.array(
      z.object({
        opening_time: z.null().or(z.string()),
        closing_time: z.null().or(z.string()),
        date: z.string(),
        store_is_closed: z.boolean(),
      })
    ),
    is_closed_now: z.boolean(),
    target_hour: z.string(),
  }),
  pdf_417_string: z.string(),
  old_app_deactivated: z.unknown(),
});
