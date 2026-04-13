import { z } from "zod";
import { phoneSchema, requiredString } from "./common.schemas";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: requiredString("Password"),
});

export const registerSchema = z
  .object({
    name: requiredString("Name"),
    email: z.string().trim().email("Invalid email address"),
    phone: phoneSchema.optional(),
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
    password: passwordSchema,
    confirmPassword: requiredString("Confirm password"),
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
