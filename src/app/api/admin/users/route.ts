import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { UserService } from "@/services/UserService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ success: true, users: await UserService.listForAdmin() });
  } catch (error) {
    return errorResponse(error);
  }
}
