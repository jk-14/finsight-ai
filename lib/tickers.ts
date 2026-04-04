/**
 * Curated static list of common US-listed stocks and ETFs.
 * Lives in server-side memory — no DB or Redis round-trip needed for ticker search.
 * Source: S&P 500 top components + major ETFs + popular retail names.
 */

export interface TickerEntry {
  ticker: string;
  name: string;
}

export const TICKERS: TickerEntry[] = [
  // ── Mega-cap tech ──
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "GOOGL", name: "Alphabet Inc. Class A" },
  { ticker: "GOOG", name: "Alphabet Inc. Class C" },
  { ticker: "META", name: "Meta Platforms Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "AVGO", name: "Broadcom Inc." },
  { ticker: "ORCL", name: "Oracle Corporation" },
  { ticker: "ADBE", name: "Adobe Inc." },
  { ticker: "CRM", name: "Salesforce Inc." },
  { ticker: "INTC", name: "Intel Corporation" },
  { ticker: "AMD", name: "Advanced Micro Devices Inc." },
  { ticker: "QCOM", name: "Qualcomm Inc." },
  { ticker: "TXN", name: "Texas Instruments Inc." },
  { ticker: "AMAT", name: "Applied Materials Inc." },
  { ticker: "MU", name: "Micron Technology Inc." },
  { ticker: "LRCX", name: "Lam Research Corporation" },
  { ticker: "KLAC", name: "KLA Corporation" },
  { ticker: "NFLX", name: "Netflix Inc." },
  { ticker: "NOW", name: "ServiceNow Inc." },
  { ticker: "PANW", name: "Palo Alto Networks Inc." },
  { ticker: "CRWD", name: "CrowdStrike Holdings Inc." },
  { ticker: "SNPS", name: "Synopsys Inc." },
  { ticker: "CDNS", name: "Cadence Design Systems Inc." },
  { ticker: "MRVL", name: "Marvell Technology Inc." },
  { ticker: "FTNT", name: "Fortinet Inc." },
  { ticker: "WDAY", name: "Workday Inc." },
  { ticker: "TEAM", name: "Atlassian Corporation" },
  { ticker: "ZS", name: "Zscaler Inc." },
  { ticker: "DDOG", name: "Datadog Inc." },
  { ticker: "SNOW", name: "Snowflake Inc." },
  { ticker: "PLTR", name: "Palantir Technologies Inc." },
  { ticker: "APP", name: "Applovin Corporation" },
  { ticker: "UBER", name: "Uber Technologies Inc." },
  { ticker: "LYFT", name: "Lyft Inc." },
  { ticker: "ABNB", name: "Airbnb Inc." },
  { ticker: "SHOP", name: "Shopify Inc." },
  { ticker: "SQ", name: "Block Inc." },
  { ticker: "PYPL", name: "PayPal Holdings Inc." },
  { ticker: "COIN", name: "Coinbase Global Inc." },
  { ticker: "RBLX", name: "Roblox Corporation" },
  { ticker: "SPOT", name: "Spotify Technology S.A." },
  { ticker: "HOOD", name: "Robinhood Markets Inc." },
  { ticker: "PATH", name: "UiPath Inc." },
  { ticker: "NET", name: "Cloudflare Inc." },
  { ticker: "MDB", name: "MongoDB Inc." },
  { ticker: "GTLB", name: "GitLab Inc." },

  // ── Financials ──
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc. Class B" },
  { ticker: "JPM", name: "JPMorgan Chase & Co." },
  { ticker: "BAC", name: "Bank of America Corporation" },
  { ticker: "WFC", name: "Wells Fargo & Company" },
  { ticker: "GS", name: "The Goldman Sachs Group Inc." },
  { ticker: "MS", name: "Morgan Stanley" },
  { ticker: "BLK", name: "BlackRock Inc." },
  { ticker: "C", name: "Citigroup Inc." },
  { ticker: "USB", name: "U.S. Bancorp" },
  { ticker: "AXP", name: "American Express Company" },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "MA", name: "Mastercard Inc." },
  { ticker: "COF", name: "Capital One Financial Corporation" },
  { ticker: "SCHW", name: "The Charles Schwab Corporation" },
  { ticker: "CB", name: "Chubb Limited" },
  { ticker: "PGR", name: "The Progressive Corporation" },
  { ticker: "MET", name: "MetLife Inc." },
  { ticker: "AFL", name: "Aflac Inc." },
  { ticker: "ICE", name: "Intercontinental Exchange Inc." },
  { ticker: "CME", name: "CME Group Inc." },

  // ── Healthcare & Pharma ──
  { ticker: "LLY", name: "Eli Lilly and Company" },
  { ticker: "UNH", name: "UnitedHealth Group Inc." },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "MRK", name: "Merck & Co. Inc." },
  { ticker: "ABBV", name: "AbbVie Inc." },
  { ticker: "TMO", name: "Thermo Fisher Scientific Inc." },
  { ticker: "ABT", name: "Abbott Laboratories" },
  { ticker: "DHR", name: "Danaher Corporation" },
  { ticker: "ISRG", name: "Intuitive Surgical Inc." },
  { ticker: "SYK", name: "Stryker Corporation" },
  { ticker: "BSX", name: "Boston Scientific Corporation" },
  { ticker: "VRTX", name: "Vertex Pharmaceuticals Inc." },
  { ticker: "REGN", name: "Regeneron Pharmaceuticals Inc." },
  { ticker: "GILD", name: "Gilead Sciences Inc." },
  { ticker: "AMGN", name: "Amgen Inc." },
  { ticker: "BMY", name: "Bristol-Myers Squibb Company" },
  { ticker: "PFE", name: "Pfizer Inc." },
  { ticker: "MRNA", name: "Moderna Inc." },
  { ticker: "CVS", name: "CVS Health Corporation" },
  { ticker: "HUM", name: "Humana Inc." },
  { ticker: "CI", name: "The Cigna Group" },

  // ── Consumer ──
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "COST", name: "Costco Wholesale Corporation" },
  { ticker: "HD", name: "The Home Depot Inc." },
  { ticker: "MCD", name: "McDonald's Corporation" },
  { ticker: "SBUX", name: "Starbucks Corporation" },
  { ticker: "NKE", name: "Nike Inc." },
  { ticker: "TGT", name: "Target Corporation" },
  { ticker: "LOW", name: "Lowe's Companies Inc." },
  { ticker: "TJX", name: "The TJX Companies Inc." },
  { ticker: "BKNG", name: "Booking Holdings Inc." },
  { ticker: "MAR", name: "Marriott International Inc." },
  { ticker: "HLT", name: "Hilton Worldwide Holdings Inc." },
  { ticker: "YUM", name: "Yum! Brands Inc." },
  { ticker: "DPZ", name: "Domino's Pizza Inc." },
  { ticker: "CMG", name: "Chipotle Mexican Grill Inc." },
  { ticker: "RCL", name: "Royal Caribbean Group" },
  { ticker: "CCL", name: "Carnival Corporation" },
  { ticker: "EXPE", name: "Expedia Group Inc." },
  { ticker: "EBAY", name: "eBay Inc." },
  { ticker: "ETSY", name: "Etsy Inc." },

  // ── Energy ──
  { ticker: "XOM", name: "Exxon Mobil Corporation" },
  { ticker: "CVX", name: "Chevron Corporation" },
  { ticker: "COP", name: "ConocoPhillips" },
  { ticker: "EOG", name: "EOG Resources Inc." },
  { ticker: "SLB", name: "SLB (Schlumberger)" },
  { ticker: "PSX", name: "Phillips 66" },
  { ticker: "VLO", name: "Valero Energy Corporation" },
  { ticker: "MPC", name: "Marathon Petroleum Corporation" },
  { ticker: "OXY", name: "Occidental Petroleum Corporation" },
  { ticker: "HAL", name: "Halliburton Company" },

  // ── Industrials ──
  { ticker: "CAT", name: "Caterpillar Inc." },
  { ticker: "DE", name: "Deere & Company" },
  { ticker: "BA", name: "The Boeing Company" },
  { ticker: "GE", name: "GE Aerospace" },
  { ticker: "HON", name: "Honeywell International Inc." },
  { ticker: "LMT", name: "Lockheed Martin Corporation" },
  { ticker: "RTX", name: "RTX Corporation" },
  { ticker: "NOC", name: "Northrop Grumman Corporation" },
  { ticker: "UPS", name: "United Parcel Service Inc." },
  { ticker: "FDX", name: "FedEx Corporation" },
  { ticker: "WM", name: "Waste Management Inc." },
  { ticker: "ETN", name: "Eaton Corporation plc" },
  { ticker: "EMR", name: "Emerson Electric Co." },
  { ticker: "PH", name: "Parker-Hannifin Corporation" },
  { ticker: "CMI", name: "Cummins Inc." },

  // ── Communications ──
  { ticker: "T", name: "AT&T Inc." },
  { ticker: "VZ", name: "Verizon Communications Inc." },
  { ticker: "TMUS", name: "T-Mobile US Inc." },
  { ticker: "DIS", name: "The Walt Disney Company" },
  { ticker: "CMCSA", name: "Comcast Corporation" },
  { ticker: "CHTR", name: "Charter Communications Inc." },
  { ticker: "WBD", name: "Warner Bros. Discovery Inc." },
  { ticker: "PARA", name: "Paramount Global" },
  { ticker: "SNAP", name: "Snap Inc." },
  { ticker: "PINS", name: "Pinterest Inc." },
  { ticker: "RDDT", name: "Reddit Inc." },

  // ── Utilities & Real Estate ──
  { ticker: "NEE", name: "NextEra Energy Inc." },
  { ticker: "DUK", name: "Duke Energy Corporation" },
  { ticker: "SO", name: "The Southern Company" },
  { ticker: "D", name: "Dominion Energy Inc." },
  { ticker: "AMT", name: "American Tower Corporation" },
  { ticker: "PLD", name: "Prologis Inc." },
  { ticker: "EQIX", name: "Equinix Inc." },
  { ticker: "CCI", name: "Crown Castle Inc." },
  { ticker: "SPG", name: "Simon Property Group Inc." },
  { ticker: "O", name: "Realty Income Corporation" },

  // ── Materials ──
  { ticker: "LIN", name: "Linde plc" },
  { ticker: "APD", name: "Air Products and Chemicals Inc." },
  { ticker: "SHW", name: "The Sherwin-Williams Company" },
  { ticker: "FCX", name: "Freeport-McMoRan Inc." },
  { ticker: "NEM", name: "Newmont Corporation" },
  { ticker: "NUE", name: "Nucor Corporation" },

  // ── ETFs ──
  { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
  { ticker: "QQQ", name: "Invesco QQQ Trust (Nasdaq-100)" },
  { ticker: "IWM", name: "iShares Russell 2000 ETF" },
  { ticker: "DIA", name: "SPDR Dow Jones Industrial Average ETF" },
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF" },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF" },
  { ticker: "VGT", name: "Vanguard Information Technology ETF" },
  { ticker: "XLK", name: "Technology Select Sector SPDR Fund" },
  { ticker: "XLF", name: "Financial Select Sector SPDR Fund" },
  { ticker: "XLE", name: "Energy Select Sector SPDR Fund" },
  { ticker: "XLV", name: "Health Care Select Sector SPDR Fund" },
  { ticker: "XLI", name: "Industrial Select Sector SPDR Fund" },
  { ticker: "GLD", name: "SPDR Gold Shares" },
  { ticker: "SLV", name: "iShares Silver Trust" },
  { ticker: "TLT", name: "iShares 20+ Year Treasury Bond ETF" },
  { ticker: "HYG", name: "iShares iBoxx $ High Yield Corporate Bond ETF" },
  { ticker: "ARKK", name: "ARK Innovation ETF" },
  { ticker: "SOXX", name: "iShares Semiconductor ETF" },
  { ticker: "IBIT", name: "iShares Bitcoin Trust ETF" },
];

/**
 * Searches TICKERS by substring match on ticker symbol or company name.
 * Case-insensitive. Returns up to `limit` results.
 */
export function searchTickers(query: string, limit = 10): TickerEntry[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];

  const results: TickerEntry[] = [];
  for (const entry of TICKERS) {
    if (entry.ticker.includes(q) || entry.name.toUpperCase().includes(q)) {
      results.push(entry);
      if (results.length === limit) break;
    }
  }
  return results;
}
