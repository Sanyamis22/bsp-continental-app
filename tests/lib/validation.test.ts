import { describe, expect, it } from "vitest";
import { createRequestSchema, parseBody, phoneSchema } from "@/lib/validation";
import { AppError } from "@/lib/errors";

describe("createRequestSchema", () => {
  it("strips fields the client must not control", () => {
    const out = parseBody(createRequestSchema, {
      serviceType: "CIBIL Audit",
      status: "Approved",
      userEmail: "victim@x.com",
      details: { panNumber: "ABCDE1234F", loanAmount: "", evil: "x" },
    });
    expect(out).not.toHaveProperty("status");
    expect(out).not.toHaveProperty("userEmail");
    expect(out.details).toEqual({ panNumber: "ABCDE1234F" });
  });

  it("rejects unknown services and non-https document links", () => {
    expect(() => parseBody(createRequestSchema, { serviceType: "Hax" })).toThrow(AppError);
    expect(() => parseBody(createRequestSchema, { serviceType: "CIBIL Audit", documentsList: [{ url: "javascript:alert(1)" }] })).toThrow(AppError);
  });

  it("caps the number of documents", () => {
    const docs = Array.from({ length: 21 }, () => ({ url: "https://x.example/a.pdf" }));
    expect(() => parseBody(createRequestSchema, { serviceType: "CIBIL Audit", documentsList: docs })).toThrow(AppError);
  });
});

describe("phoneSchema", () => {
  it("accepts 10-15 digits with optional +, rejects the rest", () => {
    expect(phoneSchema.safeParse("9575959137").success).toBe(true);
    expect(phoneSchema.safeParse("+919575959137").success).toBe(true);
    expect(phoneSchema.safeParse("12345").success).toBe(false);
    expect(phoneSchema.safeParse("98765abcde").success).toBe(false);
  });
});
