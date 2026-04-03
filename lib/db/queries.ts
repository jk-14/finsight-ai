import { eq, desc } from "drizzle-orm";
import { db } from "./index";
import { users, portfolios, holdings, aiInsights } from "./schema";

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  role?: string;
}) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

// ─── Portfolios ───────────────────────────────────────────────────────────────

export async function getPortfoliosByUserId(userId: string) {
  return db
    .select()
    .from(portfolios)
    .where(eq(portfolios.userId, userId))
    .orderBy(desc(portfolios.createdAt));
}

export async function getPortfolioById(id: string) {
  const result = await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getPortfolioWithHoldings(portfolioId: string) {
  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio) return null;

  const portfolioHoldings = await db
    .select()
    .from(holdings)
    .where(eq(holdings.portfolioId, portfolioId));

  return { ...portfolio, holdings: portfolioHoldings };
}

export async function createPortfolio(data: {
  userId: string;
  name: string;
}) {
  const result = await db.insert(portfolios).values(data).returning();
  return result[0];
}

export async function deletePortfolio(id: string) {
  await db.delete(portfolios).where(eq(portfolios.id, id));
}

// ─── Holdings ─────────────────────────────────────────────────────────────────

export async function addHolding(data: {
  portfolioId: string;
  ticker: string;
  shares: number;
  avgCost: number;
}) {
  const result = await db
    .insert(holdings)
    .values({
      portfolioId: data.portfolioId,
      ticker: data.ticker.toUpperCase(),
      shares: String(data.shares),
      avgCost: String(data.avgCost),
    })
    .returning();
  return result[0];
}

export async function deleteHolding(holdingId: string) {
  await db.delete(holdings).where(eq(holdings.id, holdingId));
}

export async function getHoldingById(holdingId: string) {
  const result = await db
    .select()
    .from(holdings)
    .where(eq(holdings.id, holdingId))
    .limit(1);
  return result[0] ?? null;
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getLatestInsight(portfolioId: string) {
  const result = await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.portfolioId, portfolioId))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);
  return result[0] ?? null;
}

export async function saveInsight(data: {
  portfolioId: string;
  content: string;
}) {
  const result = await db.insert(aiInsights).values(data).returning();
  return result[0];
}
