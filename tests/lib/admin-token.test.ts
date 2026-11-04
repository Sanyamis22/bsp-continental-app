import { describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { signAdminToken, verifyAdminToken } from "@/lib/auth/admin-token";

const enc = (s: string) => new TextEncoder().encode(s);

describe("admin token", () => {
  it("round-trips a signed token", async () => {
    const token = await signAdminToken("admin@example.com");
    expect(await verifyAdminToken(token)).toEqual({ sub: "admin@example.com", role: "super_admin" });
  });

  it("rejects missing, garbage and tampered tokens", async () => {
    const token = await signAdminToken("a@b.c");
    expect(await verifyAdminToken(undefined)).toBeNull();
    expect(await verifyAdminToken("abc")).toBeNull();
    const [h, p, sig] = token.split(".");
    expect(await verifyAdminToken(`${h}.${p}.${sig.slice(0, -2)}xx`)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const forged = await new SignJWT({ role: "super_admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("x").setIssuer("bsp-continental").setAudience("bsp-admin")
      .setExpirationTime("1h").sign(enc("some-other-secret-some-other-secret-1234"));
    expect(await verifyAdminToken(forged)).toBeNull();
  });

  it("rejects expired tokens, wrong audience and wrong role", async () => {
    const key = enc(process.env.JWT_SECRET!);
    const base = () => new SignJWT({ role: "super_admin" }).setProtectedHeader({ alg: "HS256" }).setSubject("x").setIssuer("bsp-continental").setAudience("bsp-admin");
    expect(await verifyAdminToken(await base().setExpirationTime(Math.floor(Date.now() / 1000) - 60).sign(key))).toBeNull();
    expect(await verifyAdminToken(await base().setAudience("other").setExpirationTime("1h").sign(key))).toBeNull();
    const user = await new SignJWT({ role: "user" }).setProtectedHeader({ alg: "HS256" }).setSubject("x").setIssuer("bsp-continental").setAudience("bsp-admin").setExpirationTime("1h").sign(key);
    expect(await verifyAdminToken(user)).toBeNull();
  });

  it("rejects an unsigned alg=none token", async () => {
    const b = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const none = `${b({ alg: "none" })}.${b({ role: "super_admin", sub: "x", iss: "bsp-continental", aud: "bsp-admin" })}.`;
    expect(await verifyAdminToken(none)).toBeNull();
  });
});
