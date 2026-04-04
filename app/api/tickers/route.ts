import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { searchTickers } from "@/lib/tickers";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const q = new URL(req.url).searchParams.get("q") ?? "";

    if (!q.trim()) {
      return NextResponse.json({ data: [] });
    }

    const results = searchTickers(q);
    return NextResponse.json({ data: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Missing or invalid Authorization header") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/tickers]", message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
