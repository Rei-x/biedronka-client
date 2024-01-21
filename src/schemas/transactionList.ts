import { z } from "zod";

export const transactionList = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      total_price: z.number(),
      store_name: z.string(),
      receipt_num: z.string(),
    })
  ),
  page_count: z.number(),
  page_number: z.number(),
  next_page: z.null().or(z.number()),
  previous_page: z.null().or(z.number()),
});
