import { z } from "zod";

export const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format");

export const dateStringSchema = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date format");

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export const futureOrTodayDateSchema = dateStringSchema.refine((value) => {
  const targetDate = startOfDay(new Date(value));
  const today = startOfDay(new Date());
  return targetDate >= today;
}, "Date must be today or later");
