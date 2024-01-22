import { z } from "zod";

type Mario =
  | "Loyalty"
  | "Store"
  | "Stories"
  | "Carousels"
  | "Leaflets"
  | "Products"
  | (string & {});

export const storiesList = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    thumbnail_url: z.string(),
    images: z.array(
      z.object({
        id: z.string(),
        image_url: z.string(),
        redirect_url: z.string().or(z.null()),
        order: z.number(),
      })
    ),
    sort_order: z.number(),
  })
);
