import { Quote } from "@/types";
import { redis, QUOTE_TTL, STALE_QUOTE_TTL, quoteKey, staleQuoteKey } from "@/lib/redis";
import { fetchQuoteFromFinnhub, FinnhubRateLimitError } from "@/lib/finnhub";

/**
 * Cache-first quote fetch for a single ticker.
 *
 * Flow:
 *  1. Fresh Redis hit  → return immediately
 *  2. Finnhub fetch OK → write fresh key (60s) + stale key (24h), return
 *  3. FinnhubRateLimitError → serve stale Redis key if available, else throw
 *  4. Any other error  → rethrow
 */
export async function getQuoteCached(ticker: string): Promise<Quote> {
  const fresh = await redis.get<Quote>(quoteKey(ticker));
  if (fresh) return fresh;

  try {
    const quote = await fetchQuoteFromFinnhub(ticker);
    // Write both fresh (60s) and stale backup (24h) in parallel
    await Promise.all([
      redis.set(quoteKey(ticker), quote, { ex: QUOTE_TTL }),
      redis.set(staleQuoteKey(ticker), quote, { ex: STALE_QUOTE_TTL }),
    ]);
    return quote;
  } catch (err) {
    if (err instanceof FinnhubRateLimitError) {
      const stale = await redis.get<Quote>(staleQuoteKey(ticker));
      if (stale) {
        console.error(`[quotes] Rate limited — serving stale cache for ${ticker}`);
        return stale;
      }
      throw new Error(
        `Rate limited by Finnhub and no stale data available for ${ticker}`
      );
    }
    throw err;
  }
}

/** Fetches quotes for multiple tickers concurrently using the cache-first strategy. */
export async function getQuotesCached(tickers: string[]): Promise<Quote[]> {
  return Promise.all(tickers.map(getQuoteCached));
}
