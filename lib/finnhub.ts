import { Quote } from "@/types";

const BASE_URL = "https://finnhub.io/api/v1";

export class FinnhubRateLimitError extends Error {
  constructor(ticker: string) {
    super(`Finnhub rate limit hit for ${ticker} (60 req/min free tier)`);
    this.name = "FinnhubRateLimitError";
  }
}

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error("FINNHUB_API_KEY is not set. Please add it to your .env.local file.");
  }
  return key;
}

interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}

/**
 * Fetches a real-time stock quote from Finnhub.
 * Free tier: 60 req/min with no daily cap — well-suited for a multi-ticker dashboard.
 * Throws FinnhubRateLimitError on HTTP 429 so callers can fall back to stale cache.
 */
export async function fetchQuoteFromFinnhub(ticker: string): Promise<Quote> {
  const url = `${BASE_URL}/quote?symbol=${ticker}&token=${getApiKey()}`;
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 429) {
    throw new FinnhubRateLimitError(ticker);
  }

  if (!res.ok) {
    throw new Error(`Finnhub request failed for ${ticker}: ${res.statusText}`);
  }

  const data = (await res.json()) as FinnhubQuoteResponse;

  // Finnhub returns all zeros for an unrecognised symbol
  if (data.c === 0 && data.pc === 0) {
    throw new Error(`No quote data found for ticker: ${ticker}`);
  }

  return {
    ticker: ticker.toUpperCase(),
    price: data.c,
    change: data.d,
    changePercent: data.dp,
  };
}
