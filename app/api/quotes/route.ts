import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getQuotesCached } from "@/lib/quotes";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const tickersParam = searchParams.get("tickers");

    if (!tickersParam) {
      return NextResponse.json(
        { error: "tickers query parameter is required" },
        { status: 400 }
      );
    }

    const tickers = tickersParam
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    if (tickers.length === 0) {
      return NextResponse.json(
        { error: "At least one ticker is required" },
        { status: 400 }
      );
    }

    const quotes = await getQuotesCached(tickers);
    return NextResponse.json({ data: quotes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Missing or invalid Authorization header") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/quotes]", message);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
