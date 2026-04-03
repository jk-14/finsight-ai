import { Quote } from "@/types";

const BASE_URL = "https://www.alphavantage.co/query";

function getApiKey(): string {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) {
    throw new Error(
      "ALPHA_VANTAGE_API_KEY is not set. Please add it to your .env.local file."
    );
  }
  return key;
}

interface AlphaVantageGlobalQuoteResponse {
  "Global Quote": {
    "01. symbol": string;
    "05. price": string;
    "09. change": string;
    "10. change percent": string;
  };
}

/**
 * Fetches a single stock quote from Alpha Vantage.
 * Interview talking point: We cache results in Redis (TTL 60s) to stay within
 * Alpha Vantage's free tier limit of 25 calls/day.
 */
export async function fetchQuoteFromAlphaVantage(
  ticker: string
): Promise<Quote> {
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${getApiKey()}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Alpha Vantage request failed: ${res.statusText}`);
  }

  const data = (await res.json()) as AlphaVantageGlobalQuoteResponse;
  const quote = data["Global Quote"];

  if (!quote || !quote["05. price"]) {
    throw new Error(`No quote data returned for ticker: ${ticker}`);
  }

  const changePercentRaw = quote["10. change percent"].replace("%", "");

  return {
    ticker: quote["01. symbol"],
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    changePercent: parseFloat(changePercentRaw),
  };
}
