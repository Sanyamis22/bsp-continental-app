import { describe, expect, it, vi } from "vitest";
import { unauthorized } from "@/lib/errors";

// Guards reject everything: simulates an anonymous caller. Handlers must stop before touching any service.
const deny = () => Promise.reject(unauthorized());
vi.mock("@/lib/auth/guards", () => ({
  requireUser: vi.fn(deny),
  requireAdmin: vi.fn(deny),
  getAdmin: vi.fn(() => Promise.resolve(null)),
  getUser: vi.fn(() => Promise.resolve(null)),
}));
const services = vi.hoisted(() => ({ touched: vi.fn() }));
vi.mock("@/services/RequestService", () => ({ RequestService: new Proxy({}, { get: () => services.touched }) }));
vi.mock("@/services/PricingService", () => ({ PricingService: new Proxy({}, { get: () => services.touched }) }));
vi.mock("@/services/LeadService", () => ({ LeadService: new Proxy({}, { get: () => services.touched }) }));
vi.mock("@/services/UserService", () => ({ UserService: new Proxy({}, { get: () => services.touched }) }));
vi.mock("@/services/NotificationService", () => ({ NotificationService: new Proxy({ }, { get: () => services.touched }), ADMIN_INBOX: "ADMIN" }));
vi.mock("@/services/ProfileService", () => ({ ProfileService: new Proxy({}, { get: () => services.touched }) }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: vi.fn(), clientIp: () => "1.1.1.1", assertCooldown: vi.fn(), startCooldown: vi.fn() }));

const json = (body: unknown = {}, method = "POST") =>
  new Request("http://x/api", method === "GET" ? { method } : { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

describe("anonymous callers are rejected before any service runs", () => {
  it("requests", async () => {
    const m = await import("@/app/api/requests/route");
    expect((await m.GET(json({}, "GET"))).status).toBe(401);
    expect((await m.POST(json({ serviceType: "CIBIL Audit" }))).status).toBe(401);
    expect((await m.PATCH(json({ requestId: "507f1f77bcf86cd799439011", status: "Approved" }))).status).toBe(401);
  });

  it("admin-only endpoints", async () => {
    const leads = await import("@/app/api/admin/leads/route");
    const users = await import("@/app/api/admin/users/route");
    const prices = await import("@/app/api/admin/prices/route");
    expect((await leads.GET()).status).toBe(401);
    expect((await users.GET()).status).toBe(401);
    expect((await prices.PUT(json({ slug: "property-compliance", amountInr: 1 }, "PUT"))).status).toBe(401);
  });

  it("notifications and profile", async () => {
    const n = await import("@/app/api/notifications/route");
    const p = await import("@/app/api/user/profile/route");
    expect((await n.GET(json({}, "GET"))).status).toBe(401);
    expect((await p.GET()).status).toBe(401);
    expect((await p.PUT(json({}, "PUT"))).status).toBe(401);
  });

  it("parked integrations are 404 unless their flag is on", async () => {
    const chat = await import("@/app/api/chat/route");
    const cibil = await import("@/app/api/cibil/route");
    expect((await chat.POST(json())).status).toBe(404);
    expect((await cibil.POST(json())).status).toBe(404);
  });

  it("never reached a service", () => {
    expect(services.touched).not.toHaveBeenCalled();
  });
});

describe("error body shape", () => {
  it("is { success: false, error: { code, message } }", async () => {
    const m = await import("@/app/api/admin/leads/route");
    const body = await (await m.GET()).json();
    expect(body).toEqual({ success: false, error: { code: "UNAUTHORIZED", message: expect.any(String) } });
  });
});
