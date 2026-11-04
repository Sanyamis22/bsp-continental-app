import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { PricingService } from "@/services/PricingService";

export const dynamic = "force-dynamic";

// Public: landing and service pages read the live prices from here (never cached, so a change shows immediately).
export async function GET() {
  try {
    const data = await PricingService.list();
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error, "Could not load prices.");
  }
}
