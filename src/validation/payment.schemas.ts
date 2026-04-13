import { z } from "zod";
import { requiredString } from "./common.schemas";

const cardNumberSchema = z
  .string()
  .trim()
  .refine((value) => /^\d{13,19}$/.test(value.replace(/\s+/g, "")), {
    message: "Card number must be 13 to 19 digits",
  });

const expirySchema = z
  .string()
  .trim()
  .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Expiry must be in MM/YY format")
  .refine((value) => {
    const [monthValue, yearValue] = value.split("/");
    const month = Number(monthValue);
    const year = 2000 + Number(yearValue);
    const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    return lastDayOfMonth.getTime() >= Date.now();
  }, "Card is expired");

const cvvSchema = z
  .string()
  .trim()
  .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits");

export const paymentFormSchema = z
  .object({
    method: z.enum(["card", "gcash", "paypal", "bank_transfer"]),
    cardholderName: z.string().trim().optional(),
    cardNumber: z.string().trim().optional(),
    expiry: z.string().trim().optional(),
    cvv: z.string().trim().optional(),
  })
  .superRefine((payload, ctx) => {
    if (payload.method !== "card") {
      return;
    }

    const cardholderValidation = requiredString("Cardholder name").safeParse(
      payload.cardholderName,
    );
    if (!cardholderValidation.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardholderName"],
        message:
          cardholderValidation.error.issues[0]?.message ??
          "Cardholder name is required",
      });
    }

    const cardNumberValidation = cardNumberSchema.safeParse(payload.cardNumber);
    if (!cardNumberValidation.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message:
          cardNumberValidation.error.issues[0]?.message ??
          "Invalid card number",
      });
    }

    const expiryValidation = expirySchema.safeParse(payload.expiry);
    if (!expiryValidation.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiry"],
        message: expiryValidation.error.issues[0]?.message ?? "Invalid expiry",
      });
    }

    const cvvValidation = cvvSchema.safeParse(payload.cvv);
    if (!cvvValidation.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cvv"],
        message: cvvValidation.error.issues[0]?.message ?? "Invalid CVV",
      });
    }
  });

export const otpSchema = z.object({
  otpCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;
