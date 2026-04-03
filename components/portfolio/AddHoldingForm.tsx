"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  portfolioId: string;
  onSuccess: () => void;
}

export const AddHoldingForm = ({ portfolioId, onSuccess }: Props) => {
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/portfolio/${portfolioId}/holdings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticker: ticker.trim().toUpperCase(),
          shares: parseFloat(shares),
          avgCost: parseFloat(avgCost),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to add holding");
        return;
      }

      setTicker("");
      setShares("");
      setAvgCost("");
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add holding</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md mb-3">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1 flex-1 min-w-[80px]">
              <label htmlFor="ticker" className="text-xs text-muted-foreground">
                Ticker
              </label>
              <Input
                id="ticker"
                placeholder="AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="uppercase"
                required
                maxLength={10}
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[80px]">
              <label htmlFor="shares" className="text-xs text-muted-foreground">
                Shares
              </label>
              <Input
                id="shares"
                type="number"
                placeholder="10"
                min="0.0001"
                step="0.0001"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[100px]">
              <label htmlFor="avgCost" className="text-xs text-muted-foreground">
                Avg cost ($)
              </label>
              <Input
                id="avgCost"
                type="number"
                placeholder="150.00"
                min="0.01"
                step="0.01"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="shrink-0">
              {loading ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
