import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPortfoliosByUserId, createPortfolio } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    const payload = await requireAuth(req);
    const portfolios = await getPortfoliosByUserId(payload.userId);
    return NextResponse.json({ data: portfolios });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await requireAuth(req);
    const body = await req.json();
    const { name } = body as { name: string };

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Portfolio name is required" },
        { status: 400 }
      );
    }

    const portfolio = await createPortfolio({
      userId: payload.userId,
      name: name.trim(),
    });

    return NextResponse.json({ data: portfolio }, { status: 201 });
  } catch {
    console.error("[POST /api/portfolio]");
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}
