"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TickerSearch } from "@/components/portfolio/TickerSearch";

interface Props {
  portfolioId: string;
  onSuccess: () => void;
  onClose?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const AddHoldingForm = ({
  portfolioId,
  onSuccess,
  onClose,
  onLoadingChange,
}: Props) => {
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [loading, setLoading] = useState(false);

  const setLoadingState = (val: boolean) => {
    setLoading(val);
    onLoadingChange?.(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);

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
        toast.error(json.error ?? "Failed to add holding");
        return;
      }

      const t = ticker.trim().toUpperCase();
      toast.success(`${t} added to portfolio`, {
        description: `${shares} shares @ $${parseFloat(avgCost).toFixed(2)} avg cost`,
      });
      setTicker("");
      setShares("");
      setAvgCost("");
      onSuccess();
      onClose?.();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form id="add-holding-form" onSubmit={handleSubmit} className="space-y-5 py-2">
      <div className="space-y-2">
        <label htmlFor="ticker" className="text-sm font-medium">
          Ticker
        </label>
        <TickerSearch value={ticker} onSelect={setTicker} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="shares" className="text-sm font-medium">
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
        <div className="space-y-2">
          <label htmlFor="avgCost" className="text-sm font-medium">
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
      </div>
    </form>
  );
};
