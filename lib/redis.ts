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

/** TTL in seconds for cached stock quotes */
export const QUOTE_TTL = 60;

/** Cache key pattern for a stock quote */
export const quoteKey = (ticker: string) => `quote:${ticker.toUpperCase()}`;
