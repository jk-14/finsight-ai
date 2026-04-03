import Anthropic from "@anthropic-ai/sdk";
import { Quote } from "@/types";

interface HoldingWithQuote {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  pnlPercent: number;
}

function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Please add it to your .env.local file."
    );
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function buildPrompt(
  holdingsWithQuotes: HoldingWithQuote[],
  totalValue: number,
  totalPnlPercent: number
): string {
  const holdingLines = holdingsWithQuotes
    .map(
      (h) =>
        `- ${h.ticker}: ${h.shares} shares, avg cost $${h.avgCost.toFixed(2)}, current price $${h.currentPrice.toFixed(2)}, unrealized P&L: ${h.pnlPercent.toFixed(2)}%`
    )
    .join("\n");

  return `You are a concise financial analyst assistant. The user's portfolio contains the following positions:

${holdingLines}

Total portfolio value: $${totalValue.toFixed(2)}
Total unrealized gain/loss: ${totalPnlPercent.toFixed(2)}%

Provide exactly 3 short paragraphs:
1. Overall portfolio health and diversification assessment
2. Top risk or concern (largest losing position or concentration risk)
3. One specific, actionable suggestion

Be direct and concise. No disclaimers. Max 150 words total.`;
}

export async function generatePortfolioInsight(
  holdingsRaw: Array<{ ticker: string; shares: string; avgCost: string }>,
  quotes: Quote[]
): Promise<string> {
  const quoteMap = new Map(quotes.map((q) => [q.ticker, q]));

  const holdingsWithQuotes: HoldingWithQuote[] = holdingsRaw.map((h) => {
    const quote = quoteMap.get(h.ticker);
    const currentPrice = quote?.price ?? 0;
    const shares = parseFloat(h.shares);
    const avgCost = parseFloat(h.avgCost);
    const pnlPercent = avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0;
    return { ticker: h.ticker, shares, avgCost, currentPrice, pnlPercent };
  });

  const totalValue = holdingsWithQuotes.reduce(
    (sum, h) => sum + h.shares * h.currentPrice,
    0
  );
  const totalCostBasis = holdingsWithQuotes.reduce(
    (sum, h) => sum + h.shares * h.avgCost,
    0
  );
  const totalPnlPercent =
    totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : 0;

  const client = getAnthropicClient();
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: buildPrompt(holdingsWithQuotes, totalValue, totalPnlPercent),
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return textBlock.text;
}
