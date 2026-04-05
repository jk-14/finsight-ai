/**
 * Seed script — creates the demo account and pre-loaded portfolio.
 * Run with: npx tsx scripts/seed.ts
 *
 * Safe to run multiple times — skips if the demo account already exists.
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local before any lib imports
config({ path: resolve(process.cwd(), ".env.local") });

import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const DEMO_EMAIL = "demo@finsight.ai";
const DEMO_PASSWORD = "Demo1234!";
const PORTFOLIO_NAME = "My Portfolio";

const HOLDINGS = [
  { ticker: "AAPL", shares: 50, avgCost: 150 },
  { ticker: "MSFT", shares: 30, avgCost: 280 },
  { ticker: "NVDA", shares: 15, avgCost: 400 },
  { ticker: "TSLA", shares: 10, avgCost: 200 },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.local");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding demo account…");

  // Check if demo user already exists
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, DEMO_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("✅ Demo account already exists — skipping user creation.");
  } else {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    await db.insert(schema.users).values({
      firstName: "Demo",
      lastName: "User",
      email: DEMO_EMAIL,
      passwordHash,
      role: "admin",
    });
    console.log(`✅ Created user: ${DEMO_EMAIL}`);
  }

  // Re-fetch to get the user id
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, DEMO_EMAIL))
    .limit(1);

  // Check if portfolio already exists
  const existingPortfolios = await db
    .select()
    .from(schema.portfolios)
    .where(eq(schema.portfolios.userId, user.id));

  if (existingPortfolios.length > 0) {
    console.log("✅ Demo portfolio already exists — skipping portfolio creation.");
    console.log("\n🎉 Seed complete. Login: demo@finsight.ai / Demo1234!");
    return;
  }

  const [portfolio] = await db
    .insert(schema.portfolios)
    .values({ userId: user.id, name: PORTFOLIO_NAME })
    .returning();

  console.log(`✅ Created portfolio: "${PORTFOLIO_NAME}"`);

  await db.insert(schema.holdings).values(
    HOLDINGS.map((h) => ({
      portfolioId: portfolio.id,
      ticker: h.ticker,
      shares: String(h.shares),
      avgCost: String(h.avgCost),
    }))
  );

  console.log(`✅ Added holdings: ${HOLDINGS.map((h) => h.ticker).join(", ")}`);
  console.log("\n🎉 Seed complete. Login: demo@finsight.ai / Demo1234!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
