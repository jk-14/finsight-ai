"use client";

import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Holding, Quote } from "@/types";

interface Props {
  holdings: Holding[];
  quotes: Quote[];
  loading: boolean;
}

export const PnLSummaryCard = ({ holdings, quotes, loading }: Props) => {
  const quoteMap = new Map(quotes.map((q) => [q.ticker, q]));

  let totalValue = 0;
  let totalCostBasis = 0;

  for (const holding of holdings) {
    const shares = parseFloat(holding.shares);
    const avgCost = parseFloat(holding.avgCost);
    const price = quoteMap.get(holding.ticker)?.price ?? 0;

    totalValue += shares * price;
    totalCostBasis += shares * avgCost;
  }

  const totalPnlDollar = totalValue - totalCostBasis;
  const totalPnlPercent =
    totalCostBasis > 0 ? (totalPnlDollar / totalCostBasis) * 100 : 0;
  const isPositive = totalPnlDollar >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const metrics = [
    {
      label: "Total value",
      value: fmt(totalValue),
      icon: DollarSign,
      color: "text-foreground",
    },
    {
      label: "Total gain / loss",
      value: `${isPositive ? "+" : ""}${fmt(totalPnlDollar)}`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-green-500" : "text-red-500",
    },
    {
      label: "Return",
      value: `${isPositive ? "+" : ""}${totalPnlPercent.toFixed(2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-green-500" : "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
