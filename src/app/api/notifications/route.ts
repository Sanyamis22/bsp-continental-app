import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin, requireUser } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { objectIdSchema, parseBody } from "@/lib/validation";
import { ADMIN_INBOX, NotificationService } from "@/services/NotificationService";

/** Admin reads the shared inbox; users only ever read their own. */
async function resolveRecipient(): Promise<string> {
  if (await getAdmin()) return ADMIN_INBOX;
  return (await requireUser()).email;
}

export async function GET() {
  try {
    const data = await NotificationService.list(await resolveRecipient());
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}

const markReadSchema = z.object({ notificationId: objectIdSchema });

export async function PATCH(req: Request) {
  try {
    const recipient = await resolveRecipient();
    const { notificationId } = parseBody(markReadSchema, await req.json().catch(() => null));
    const data = await NotificationService.markRead(notificationId, recipient);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
