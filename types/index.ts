// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  createdAt: Date | null;
}

export interface Holding {
  id: string;
  portfolioId: string;
  ticker: string;
  shares: string; // numeric comes back as string from Drizzle
  avgCost: string; // numeric comes back as string from Drizzle
  addedAt: Date | null;
}

export interface PortfolioWithHoldings extends Portfolio {
  holdings: Holding[];
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

export interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export interface Insight {
  id: string;
  portfolioId: string;
  content: string;
  generatedAt: Date | null;
}

export interface InsightResponse {
  insight: string;
  generatedAt: string;
}
