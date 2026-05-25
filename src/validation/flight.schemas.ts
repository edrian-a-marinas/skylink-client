import { z } from "zod";
import {
  dateStringSchema,
  futureOrTodayDateSchema,
  requiredString,
} from "./common.schemas";

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

export const flightSchema = z.object({
  flightNumber: requiredString("Flight Number"),
  origin: requiredString("Origin"),
  destination: requiredString("Destination"),
  departureTime: dateStringSchema,
  arrivalTime: dateStringSchema,
  price: z.coerce.number().min(0, "Price must be positive"),
  airline: requiredString("Airline"),
  seatsAvailable: z.coerce.number().int().min(0, "Seats must be positive"),
  totalSeats: z.coerce.number().int().min(1, "Total seats is required"),
  status: z
    .enum(["scheduled", "boarding", "on_time", "delayed", "cancelled", "landed"])
    .default("scheduled"),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
  baggageAllowanceKg: z.coerce.number().min(0).optional(),
  stops: z.coerce.number().int().min(0).default(0),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
