"use client";

import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  ticker: string;
}

/**
 * Generates deterministic mock 30-day price data from the ticker string.
 * In production this would be replaced with real historical data from a market data API.
 */
function generateMockHistory(ticker: string): { value: number }[] {
  const seed = ticker
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  let price = 100 + (seed % 400);
  return Array.from({ length: 30 }, (_, i) => {
    const change = Math.sin((i + seed) * 0.7) * 3 + (Math.cos(i * 0.3 + seed) * 2);
    price = Math.max(10, price + change);
    return { value: parseFloat(price.toFixed(2)) };
  });
}

export const SparklineCell = ({ ticker }: Props) => {
  const data = useMemo(() => generateMockHistory(ticker), [ticker]);
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const color = last >= first ? "#10b981" : "#f43f5e";

  return (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`spark-${ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${ticker})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
