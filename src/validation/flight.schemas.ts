import { z } from "zod";
import { futureOrTodayDateSchema, requiredString } from "./common.schemas";

export const flightSearchSchema = z
  .object({
    origin: requiredString("Origin"),
    destination: requiredString("Destination"),
    date: futureOrTodayDateSchema,
    passengers: z.coerce
      .number()
      .int("Passengers must be a whole number")
      .min(1, "At least 1 passenger is required")
      .max(9, "Maximum 9 passengers allowed"),
    cabinClass: z
      .enum(["economy", "premium_economy", "business", "first"])
      .optional(),
  })
  .refine(
    (payload) =>
      payload.origin.trim().toLowerCase() !==
      payload.destination.trim().toLowerCase(),
    {
      message: "Origin and destination must be different",
      path: ["destination"],
    },
  );

export type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;
