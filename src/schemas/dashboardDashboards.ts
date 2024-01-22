import { z } from "zod";

export const DashboardType = {
  Loyalty: "Loyalty",
  Store: "Store",
  Stories: "Stories",
  Carousels: "Carousels",
  Leaflets: "Leaflets",
  Products: "Products",
} as const;

export const dashboardDashboards = z.array(
  z.object({
    slug: z.string(),
    type: z.nativeEnum(DashboardType).or(z.string().and(z.object({}))),
    param: z.string().or(z.null()),
  })
);
