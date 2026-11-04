import { z } from "zod";
import { SERVICE_TYPES } from "@/types/request";
import { badRequest } from "@/lib/errors";

/** Parse a request body with a zod schema, or throw 400 with the first issue. */
export function parseBody<S extends z.ZodType>(schema: S, raw: unknown): z.infer<S> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issue = result.error.issues[0];
    const path = issue?.path.join(".");
    throw badRequest(path ? `Invalid "${path}": ${issue.message}` : "Invalid request body.");
  }
  return result.data;
}

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "must be a valid id");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?\d{10,15}$/, "must be a valid mobile number");

export const emailSchema = z.email().max(200);

const emptyToUndefined = (v: unknown) => (v === "" || v === null ? undefined : v);
const optionalText = (max: number) => z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());
const optionalAmount = z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(1e12).optional());

export const requestDetailsSchema = z
  .object({
    ownerName: optionalText(200),
    propertyLocation: optionalText(500),
    bankName: optionalText(200),
    loanAmount: optionalAmount,
    monthlyIncome: optionalAmount,
    rejectionReason: optionalText(1000),
    customMessage: optionalText(2000),
    panNumber: optionalText(20),
    dateOfBirth: optionalText(20),
    selectedServices: z.array(z.string().trim().max(200)).max(30).optional(),
  })
  .default({});

export const documentSchema = z.object({
  name: z.string().trim().max(300).optional(),
  url: z.string().trim().max(2000).startsWith("https://").optional(),
  size: z.union([z.string().max(50), z.number()]).transform(String).optional(),
  docType: z.string().trim().max(100).optional(),
});

export const createRequestSchema = z.object({
  userName: optionalText(200),
  userPhone: optionalText(20),
  serviceType: z.enum(SERVICE_TYPES),
  details: requestDetailsSchema,
  documentsList: z.array(documentSchema).max(20).default([]),
});
