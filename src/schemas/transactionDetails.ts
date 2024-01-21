import { z } from "zod";

export const transactionDetails = z.object({
  id: z.string(),
  date: z.string(),
  total_price: z.number(),
  store_name: z.string(),
  receipt_num: z.string(),
  total_discount: z.number(),
  store_id: z.string(),
  cash_register_id: z.number(),
  id_from_receipt: z.string(),
  cashier_id: z.null(),
  basket_id: z.null(),
  invoice_id: z.null(),
  total_tax: z.number(),
  due_change: z.number(),
  items: z.array(
    z.object({
      position: z.string(),
      name: z.string(),
      quantity: z.number(),
      unit_price: z.number(),
      total_discount: z.number(),
      total_price_without_discount: z.number(),
      total_price: z.number(),
      ean: z.string(),
      vat_rate: z.number(),
      vat_fiscal_code: z.string(),
    })
  ),
  payments: z.array(
    z.object({ payment_type: z.string(), value: z.number(), name: z.string() })
  ),
  tax_summaries: z.array(
    z.object({
      vat_rate: z.number(),
      sale_value: z.number(),
      tax_value: z.number(),
      vat_fiscal_code: z.string(),
    })
  ),
});
