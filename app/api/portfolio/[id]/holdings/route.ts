import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPortfolioById, addHolding } from "@/lib/db/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await requireAuth(req);
    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    if (portfolio.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { ticker, shares, avgCost } = body as {
      ticker: unknown;
      shares: unknown;
      avgCost: unknown;
    };

    if (!ticker || typeof ticker !== "string" || !ticker.trim()) {
      return NextResponse.json({ error: "ticker is required" }, { status: 400 });
    }

    if (typeof shares !== "number" || isNaN(shares) || shares <= 0) {
      return NextResponse.json(
        { error: "shares must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof avgCost !== "number" || isNaN(avgCost) || avgCost <= 0) {
      return NextResponse.json(
        { error: "avgCost must be a positive number" },
        { status: 400 }
      );
    }

    const holding = await addHolding({
      portfolioId: id,
      ticker: ticker.trim().toUpperCase(),
      shares,
      avgCost,
    });

    return NextResponse.json({ data: holding }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/portfolio/[id]/holdings]", err);
    return NextResponse.json({ error: "Failed to add holding" }, { status: 500 });
  }
}
