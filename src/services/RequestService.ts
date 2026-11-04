import { RequestRepository } from "@/repositories/RequestRepository";
import { NotificationService } from "@/services/NotificationService";
import { notFound } from "@/lib/errors";
import { errorMessage } from "@/types/api";
import type { CreateRequestInput, DecideRequestInput } from "@/types/request";

/** Notifications are best-effort: a failed alert must never fail the request itself. */
async function bestEffort(label: string, task: () => Promise<unknown>) {
  try {
    await task();
  } catch (err) {
    console.warn(`${label} skipped safely:`, errorMessage(err));
  }
}

/** Owns every Request rule: who may see what, and the status transitions. */
export const RequestService = {
  listForUser(email: string) {
    return RequestRepository.list({ userEmail: email });
  },

  listForAdmin(filterEmail?: string) {
    return RequestRepository.list(filterEmail ? { userEmail: filterEmail } : {});
  },

  async submit(user: { email: string; name: string }, input: CreateRequestInput) {
    const created = await RequestRepository.create({
      ...input,
      userName: input.userName || user.name || "Client",
      userEmail: user.email,
    });

    await bestEffort("Admin notification", () =>
      NotificationService.notifyAdminOfNewRequest({
        userName: created.userName,
        serviceType: input.serviceType,
        requestId: created._id,
      })
    );
    return created;
  },

  async decide(input: DecideRequestInput) {
    const hasReply = input.adminMessage !== undefined || input.adminDocument !== undefined;
    const updated = await RequestRepository.applyDecision(input.requestId, {
      status: input.status,
      ...(hasReply && {
        adminReply: {
          message: input.adminMessage || "",
          document: input.adminDocument || { name: "", url: "" },
          updatedAt: new Date(),
        },
      }),
    });
    if (!updated) throw notFound("Request not found.");

    await bestEffort("User notification", () =>
      NotificationService.notifyUserOfDecision({
        userEmail: updated.userEmail,
        serviceType: updated.serviceType,
        status: input.status,
        adminMessage: input.adminMessage,
        requestId: updated._id,
      })
    );
    return updated;
  },
};
