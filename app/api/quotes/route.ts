import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { redis, QUOTE_TTL, quoteKey } from "@/lib/redis";
import { fetchQuoteFromAlphaVantage } from "@/lib/alpha-vantage";
import { Quote } from "@/types";

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

    // Cache-first: check Redis for each ticker, fall back to Alpha Vantage on miss.
    // Interview talking point: 60s TTL keeps us within Alpha Vantage's 25 calls/day free limit.
    const quotes = await Promise.all(
      tickers.map(async (ticker): Promise<Quote> => {
        const cached = await redis.get<Quote>(quoteKey(ticker));
        if (cached) return cached;

        const quote = await fetchQuoteFromAlphaVantage(ticker);
        await redis.set(quoteKey(ticker), quote, { ex: QUOTE_TTL });
        return quote;
      })
    );

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
