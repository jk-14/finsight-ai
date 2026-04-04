import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL is not set. Please add it to your .env.local file."
  );
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    "UPSTASH_REDIS_REST_TOKEN is not set. Please add it to your .env.local file."
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/** TTL in seconds for fresh stock quotes (1 minute) */
export const QUOTE_TTL = 60;

/** TTL in seconds for stale fallback quotes (24 hours) */
export const STALE_QUOTE_TTL = 86400;

/** Cache key for a fresh stock quote */
export const quoteKey = (ticker: string) => `quote:${ticker.toUpperCase()}`;

/** Cache key for stale fallback — written alongside every fresh quote, survives 24h */
export const staleQuoteKey = (ticker: string) => `quote:stale:${ticker.toUpperCase()}`;
