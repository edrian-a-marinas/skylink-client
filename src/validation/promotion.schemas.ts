import { z } from "zod";
import { requiredString } from "./common.schemas";

export const promotionSchema = z.object({
  title: requiredString("Title"),
  sale_price: z.number().min(0, "Sale price must be positive"),
  original_price: z.number().min(0, "Original price must be positive"),
  category: z.enum(["flash", "weekend", "international", "promo"]),
  valid_until: z.string().min(1, "Expiration date is required"),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  destination_code: z
    .string()
    .length(3, "Destination code must be exactly 3 characters")
    .toUpperCase(),
  destination_city: requiredString("Destination City"),
});

export type PromotionFormValues = z.infer<typeof promotionSchema>;
