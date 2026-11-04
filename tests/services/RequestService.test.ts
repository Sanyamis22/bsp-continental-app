import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({ list: vi.fn(), create: vi.fn(), applyDecision: vi.fn() }));
const notify = vi.hoisted(() => ({ notifyAdminOfNewRequest: vi.fn(), notifyUserOfDecision: vi.fn() }));
vi.mock("@/repositories/RequestRepository", () => ({ RequestRepository: repo }));
vi.mock("@/services/NotificationService", () => ({ NotificationService: notify }));

import { RequestService } from "@/services/RequestService";

const input = { serviceType: "CIBIL Audit" as const, details: {}, documentsList: [] };

beforeEach(() => {
  Object.values(repo).forEach((f) => f.mockReset());
  Object.values(notify).forEach((f) => f.mockReset().mockResolvedValue(undefined));
});

describe("RequestService", () => {
  it("scopes a client's list to their own email", async () => {
    repo.list.mockResolvedValue([]);
    await RequestService.listForUser("me@x.com");
    expect(repo.list).toHaveBeenCalledWith({ userEmail: "me@x.com" });
  });

  it("lets the admin list everything or filter by email", async () => {
    repo.list.mockResolvedValue([]);
    await RequestService.listForAdmin();
    await RequestService.listForAdmin("a@x.com");
    expect(repo.list).toHaveBeenNthCalledWith(1, {});
    expect(repo.list).toHaveBeenNthCalledWith(2, { userEmail: "a@x.com" });
  });

  it("stores the session identity, not anything from the input", async () => {
    repo.create.mockResolvedValue({ _id: "1", userName: "Ann" });
    await RequestService.submit({ email: "ann@x.com", name: "Ann" }, input);
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ userEmail: "ann@x.com", userName: "Ann" }));
  });

  it("still succeeds when the admin notification fails", async () => {
    repo.create.mockResolvedValue({ _id: "1", userName: "Ann" });
    notify.notifyAdminOfNewRequest.mockRejectedValue(new Error("db down"));
    await expect(RequestService.submit({ email: "ann@x.com", name: "Ann" }, input)).resolves.toBeTruthy();
  });

  it("404s a decision for a missing request and does not notify", async () => {
    repo.applyDecision.mockResolvedValue(null);
    await expect(RequestService.decide({ requestId: "x", status: "Approved" })).rejects.toMatchObject({ status: 404 });
    expect(notify.notifyUserOfDecision).not.toHaveBeenCalled();
  });

  it("records the reply and notifies the client on a decision", async () => {
    repo.applyDecision.mockResolvedValue({ _id: "1", userEmail: "ann@x.com", serviceType: "CIBIL Audit" });
    await RequestService.decide({ requestId: "1", status: "Approved", adminMessage: "Done" });
    expect(repo.applyDecision).toHaveBeenCalledWith("1", expect.objectContaining({ status: "Approved", adminReply: expect.objectContaining({ message: "Done" }) }));
    expect(notify.notifyUserOfDecision).toHaveBeenCalledWith(expect.objectContaining({ userEmail: "ann@x.com", status: "Approved" }));
  });
});
