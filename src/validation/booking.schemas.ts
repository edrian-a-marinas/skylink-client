import { z } from "zod";
import {
  futureOrTodayDateSchema,
  phoneSchema,
  requiredString,
} from "./common.schemas";

export const passengerSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  dateOfBirth: requiredString("Date of birth"),
  passport: requiredString("Passport / ID"),
  seatNumber: z.string().trim().optional(),
  mealPreference: z
    .enum(["standard", "vegetarian", "vegan", "halal", "kosher", "child"])
    .optional(),
});

export const passengerDetailsFormSchema = z.object({
  contactEmail: z.string().trim().email("Invalid email address"),
  contactPhone: phoneSchema,
  passengers: z
    .array(passengerSchema)
    .min(1, "At least one passenger is required"),
});

export const seatSelectionSchema = z.object({
  selectedSeats: z.array(requiredString("Seat")).optional(),
});

export const mealPreferenceSchema = z.object({
  meals: z
    .array(
      z.enum(["standard", "vegetarian", "vegan", "halal", "kosher", "child"]),
    )
    .optional(),
});

export const cancellationSchema = z.object({
  reason: requiredString("Cancellation reason"),
  refundMethod: z.enum(["original", "bank_transfer", "wallet"]).optional(),
});

export const reschedulePickSchema = z.object({
  newDate: futureOrTodayDateSchema,
  newFlightId: requiredString("New flight"),
  reason: requiredString("Reschedule reason"),
});

export const reportDateRangeSchema = z
  .object({
    startDate: futureOrTodayDateSchema,
    endDate: futureOrTodayDateSchema,
  })
  .refine(
    ({ startDate, endDate }) =>
      new Date(endDate).getTime() >= new Date(startDate).getTime(),
    {
      message: "End date must be the same as or later than start date",
      path: ["endDate"],
    },
  );

export type PassengerDetailsFormValues = z.infer<
  typeof passengerDetailsFormSchema
>;
export type CancellationFormValues = z.infer<typeof cancellationSchema>;
export type ReschedulePickFormValues = z.infer<typeof reschedulePickSchema>;
