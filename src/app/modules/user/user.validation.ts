import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be an string" })
    .min(2, { message: "minimum 2 character" })
    .max(50, { message: "maximum 50 character" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Za-z]/, {
      message: "Password must contain at least one letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one symbol",
    }),
  phone: z
    .string()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladesh number",
    })
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address must be maximum 200 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be an string" })
    .min(2, { message: "minimum 2 character" })
    .max(50, { message: "maximum 50 character" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Za-z]/, {
      message: "Password must contain at least one letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one symbol",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladesh number",
    })
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address must be maximum 200 characters" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values[IsActive] as [string]).optional(),
  isDeleted: z.boolean({ error: "IsDeleted must be true or false" }).optional(),
  isVerified: z
    .boolean({ error: "IsVerified must be true or false" })
    .optional(),
});
