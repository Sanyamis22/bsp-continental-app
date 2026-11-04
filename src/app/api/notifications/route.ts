import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { objectIdSchema, parseBody } from "@/lib/validation";
import { ADMIN_INBOX, NotificationService } from "@/services/NotificationService";

/** `?scope=admin` → shared admin inbox. Default → signed-in user's inbox (admin cookie alone cannot widen). */
async function resolveRecipient(req: Request): Promise<string> {
  const scope = new URL(req.url).searchParams.get("scope");
  if (scope === "admin") {
    await requireAdmin();
    return ADMIN_INBOX;
  }
  return (await requireUser()).email;
}

export async function GET(req: Request) {
  try {
    const data = await NotificationService.list(await resolveRecipient(req));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}

const markReadSchema = z.object({ notificationId: objectIdSchema });

export async function PATCH(req: Request) {
  try {
    const recipient = await resolveRecipient(req);
    const { notificationId } = parseBody(markReadSchema, await req.json().catch(() => null));
    const data = await NotificationService.markRead(notificationId, recipient);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
