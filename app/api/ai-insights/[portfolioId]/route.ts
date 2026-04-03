import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getPortfolioWithHoldings,
  getLatestInsight,
  saveInsight,
} from "@/lib/db/queries";
import { fetchQuoteFromAlphaVantage } from "@/lib/alpha-vantage";
import { redis, QUOTE_TTL, quoteKey } from "@/lib/redis";
import { generatePortfolioInsight } from "@/lib/claude";
import { Quote } from "@/types";

async function getQuotesCached(tickers: string[]): Promise<Quote[]> {
  return Promise.all(
    tickers.map(async (ticker): Promise<Quote> => {
      const cached = await redis.get<Quote>(quoteKey(ticker));
      if (cached) return cached;
      const quote = await fetchQuoteFromAlphaVantage(ticker);
      await redis.set(quoteKey(ticker), quote, { ex: QUOTE_TTL });
      return quote;
    })
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ portfolioId: string }> }
) {
  try {
    const { portfolioId } = await params;
    const payload = await requireAuth(req);
    const portfolio = await getPortfolioWithHoldings(portfolioId);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const insight = await getLatestInsight(portfolioId);

    if (!insight) {
      return NextResponse.json({ data: { insight: null } });
    }

    return NextResponse.json({
      data: {
        insight: insight.content,
        generatedAt: insight.generatedAt?.toISOString() ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ portfolioId: string }> }
) {
  try {
    const { portfolioId } = await params;
    const payload = await requireAuth(req);
    const portfolio = await getPortfolioWithHoldings(portfolioId);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (portfolio.holdings.length === 0) {
      return NextResponse.json(
        { error: "Add at least one holding before generating insights" },
        { status: 400 }
      );
    }

    const tickers = portfolio.holdings.map((h) => h.ticker);
    const quotes = await getQuotesCached(tickers);

    const content = await generatePortfolioInsight(portfolio.holdings, quotes);
    const saved = await saveInsight({ portfolioId, content });

    return NextResponse.json({
      data: {
        insight: saved.content,
        generatedAt: saved.generatedAt?.toISOString() ?? null,
      },
    });
  } catch {
    console.error("[POST /api/ai-insights/[portfolioId]]");
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}
