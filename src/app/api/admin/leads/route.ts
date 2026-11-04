import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { LeadService } from "@/services/LeadService";

export async function GET() {
  try {
    await requireAdmin();
    const { inquiries, contacts } = await LeadService.listAll();
    return NextResponse.json({ success: true, inquiries, contacts });
  } catch (error) {
    return errorResponse(error);
  }
}
