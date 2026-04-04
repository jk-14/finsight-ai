"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Holding, Quote } from "@/types";

interface Props {
  holdings: Holding[];
  quotes: Quote[];
}

/**
 * Generates a mock 30-day portfolio value history based on current holdings and quotes.
 * Simulates price movement backwards from today's values using seeded noise.
 * In production this would use real OHLCV data from a market data provider.
 */
function generatePortfolioHistory(
  holdings: Holding[],
  quotes: Quote[]
): { date: string; value: number }[] {
  const quoteMap = new Map(quotes.map((q) => [q.ticker, q]));
  const today = new Date();

  return Array.from({ length: 30 }, (_, dayIndex) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - dayIndex));

    let dayValue = 0;
    for (const holding of holdings) {
      const currentPrice = quoteMap.get(holding.ticker)?.price ?? 0;
      const shares = parseFloat(holding.shares);
      // Approximate past price with sinusoidal noise per ticker
      const seed = holding.ticker
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const noise =
        Math.sin((dayIndex + seed) * 0.5) * 0.03 +
        Math.cos(dayIndex * 0.3 + seed * 0.1) * 0.015;
      const pastPrice = currentPrice * (1 - noise * (30 - dayIndex) * 0.01);
      dayValue += shares * Math.max(0, pastPrice);
    }

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(dayValue.toFixed(2)),
    };
  });
}

export const PerformanceChart = ({ holdings, quotes }: Props) => {
  const data = useMemo(
    () => generatePortfolioHistory(holdings, quotes),
    [holdings, quotes]
  );

  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const isPositive = last >= first;
  const color = isPositive ? "#10b981" : "#f43f5e";

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  // Pad by 15% of the delta so the line never sits flush against the axis edges.
  // Fall back to 1% of the max value when all data points are identical.
  const delta = maxVal - minVal || maxVal * 0.01;
  const yMin = Math.max(0, minVal - delta * 0.15);
  const yMax = maxVal + delta * 0.15;

  if (holdings.length === 0 || quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">30-Day Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Add holdings to see performance chart.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">30-Day Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="perf-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                `$${(v as number).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              }
              width={70}
            />
            <Tooltip
              formatter={(value) => [
                typeof value === "number"
                  ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "-",
                "Portfolio value",
              ]}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#perf-gradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
