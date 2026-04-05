import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getPortfolioWithHoldings,
  getPortfolioById,
  deletePortfolio,
} from "@/lib/db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await requireAuth(req);
    const portfolio = await getPortfolioWithHoldings(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Ensure the portfolio belongs to the authenticated user
    if (portfolio.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: portfolio });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
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

    await deletePortfolio(id);
    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("[DELETE /api/portfolio/[id]]", err);
    return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
  }
}
