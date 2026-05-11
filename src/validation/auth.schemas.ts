import { z } from "zod";
import { phoneSchema, requiredString } from "./common.schemas";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: requiredString("Password"),
});

export const registerSchema = z
  .object({
    first_name: requiredString("First name"),
    last_name: requiredString("Last name"),
    email: z.string().trim().email("Invalid email address"),
    phone_number: phoneSchema.optional(),
    password: passwordSchema,
    confirmPassword: requiredString("Confirm password"),
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: requiredString("Reset token"),
    new_password: passwordSchema,
    confirmPassword: requiredString("Confirm password"),
  })
  .refine((payload) => payload.new_password === payload.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;