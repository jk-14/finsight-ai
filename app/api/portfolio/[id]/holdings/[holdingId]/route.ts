import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPortfolioById, getHoldingById, deleteHolding } from "@/lib/db/queries";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; holdingId: string }> }
) {
  try {
    const { id, holdingId } = await params;
    const payload = await requireAuth(req);
    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const holding = await getHoldingById(holdingId);
    if (!holding || holding.portfolioId !== id) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    await deleteHolding(holdingId);
    return NextResponse.json({ data: { success: true } });
  } catch {
    console.error("[DELETE /api/portfolio/[id]/holdings/[holdingId]]");
    return NextResponse.json(
      { error: "Failed to delete holding" },
      { status: 500 }
    );
  }
}
