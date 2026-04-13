import { z } from "zod";

export const pnrSchema = z.object({
  pnr: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine((value) => /^[A-Z0-9]{6}$/.test(value), {
      message: "PNR must be exactly 6 alphanumeric characters",
    }),
});

export type PNRFormValues = z.infer<typeof pnrSchema>;
