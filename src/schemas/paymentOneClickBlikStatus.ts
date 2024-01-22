import { z } from "zod";
import { usersMe } from "./usersMe";

export const ActivationStatus = {
  Registered: "AliasRegistered",
  InProgress: "ActivationInProgress",
  NotRegistered: "AliasNotRegistered",
  Rejected: "AuthRejected",
} as const;

export const paymentOneClickBlikStatus = z.object({
  activation_status: z.nativeEnum(ActivationStatus),
  time_stamp: z.string(),
  customer_id: z.string(),
  customer: usersMe,
});
