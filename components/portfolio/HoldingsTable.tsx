"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklineCell } from "@/components/charts/SparklineCell";
import { Holding, Quote } from "@/types";

interface Props {
  holdings: Holding[];
  quotes: Quote[];
  quotesLoading: boolean;
  onDelete: (holdingId: string) => void;
  deleting: string | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export const HoldingsTable = ({
  holdings,
  quotes,
  quotesLoading,
  onDelete,
  deleting,
}: Props) => {
  const [pendingDelete, setPendingDelete] = useState<Holding | null>(null);
  const quoteMap = new Map(quotes.map((q) => [q.ticker, q]));

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No holdings yet. Add your first position above.
      </div>
    );
  }

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Avg Cost</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Market Value</TableHead>
          <TableHead className="text-right">P&amp;L</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((holding) => {
          const quote = quoteMap.get(holding.ticker);
          const shares = parseFloat(holding.shares);
          const avgCost = parseFloat(holding.avgCost);
          const currentPrice = quote?.price ?? 0;
          const marketValue = shares * currentPrice;
          const costBasis = shares * avgCost;
          const pnlDollar = marketValue - costBasis;
          const pnlPercent = costBasis > 0 ? (pnlDollar / costBasis) * 100 : 0;
          const isPositive = pnlPercent >= 0;

          return (
            <TableRow key={holding.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <span>{holding.ticker}</span>
                  {!quotesLoading && quote && (
                    <SparklineCell ticker={holding.ticker} />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">{parseFloat(holding.shares).toLocaleString()}</TableCell>
              <TableCell className="text-right">{formatCurrency(avgCost)}</TableCell>
              <TableCell className="text-right">
                {quotesLoading ? (
                  <Skeleton className="h-4 w-16 ml-auto" />
                ) : quote ? (
                  <span>{formatCurrency(quote.price)}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {quotesLoading ? (
                  <Skeleton className="h-4 w-20 ml-auto" />
                ) : (
                  formatCurrency(marketValue)
                )}
              </TableCell>
              <TableCell className="text-right">
                {quotesLoading ? (
                  <Skeleton className="h-4 w-20 ml-auto" />
                ) : (
                  <span className={`ml-auto font-mono ${isPositive ? "badge-gain" : "badge-loss"}`}>
                    {formatPercent(pnlPercent)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setPendingDelete(holding)}
                  disabled={deleting === holding.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>

    <Dialog
      open={!!pendingDelete}
      onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Remove holding</DialogTitle>
          <DialogDescription>
            Remove <span className="font-medium text-foreground">{pendingDelete?.ticker}</span> from your portfolio? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleting === pendingDelete?.id}
            onClick={() => {
              if (pendingDelete) {
                onDelete(pendingDelete.id);
                setPendingDelete(null);
              }
            }}
          >
            {deleting === pendingDelete?.id ? "Removing…" : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
