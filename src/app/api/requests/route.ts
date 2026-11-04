import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { createRequestSchema, documentSchema, objectIdSchema, parseBody } from "@/lib/validation";
import { RequestService } from "@/services/RequestService";
import { REQUEST_STATUSES } from "@/types/request";

// GET: `?scope=admin` requires admin JWT and returns the full queue.
// Default (client) always uses the user session — an admin cookie alone cannot widen it.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("scope") === "admin") {
      await requireAdmin();
      const email = url.searchParams.get("email");
      const filter = email && email !== "null" && email !== "undefined" ? email : undefined;
      return NextResponse.json({ success: true, data: await RequestService.listForAdmin(filter) });
    }
    const user = await requireUser();
    return NextResponse.json({ success: true, data: await RequestService.listForUser(user.email) });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST: a signed-in user submits a request. Identity comes from the session, never the body.
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = parseBody(createRequestSchema, await req.json().catch(() => null));
    const created = await RequestService.submit(user, body);
    return NextResponse.json(
      { success: true, message: "Request saved in database!", data: created },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

const decisionSchema = z.object({
  requestId: objectIdSchema,
  status: z.enum(REQUEST_STATUSES),
  adminMessage: z.string().trim().max(2000).optional(),
  adminDocument: documentSchema.pick({ name: true, url: true }).optional(),
});

// PATCH: admin decision dispatch.
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const input = parseBody(decisionSchema, await req.json().catch(() => null));
    const updated = await RequestService.decide(input);
    return NextResponse.json({
      success: true,
      message: "Client status and reply updated successfully!",
      data: updated,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
