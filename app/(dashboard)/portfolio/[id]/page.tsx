"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { PortfolioWithHoldings, Quote } from "@/types";
import { PnLSummaryCard } from "@/components/portfolio/PnLSummaryCard";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { AddHoldingForm } from "@/components/portfolio/AddHoldingForm";
import { AllocationChart } from "@/components/portfolio/AllocationChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { InsightPanel } from "@/components/ai/InsightPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth, fetchWithAuthJson } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<{
    data: PortfolioWithHoldings;
  }>({
    queryKey: ["portfolio", id],
    queryFn: () => fetchWithAuthJson(`/api/portfolio/${id}`),
    enabled: !!id,
  });

  const portfolio = portfolioData?.data;
  const tickers = portfolio?.holdings.map((h) => h.ticker) ?? [];

  const { data: quotesData, isFetching: quotesLoading } = useQuery<{
    data: Quote[];
  }>({
    queryKey: ["quotes", tickers.join(",")],
    queryFn: () => fetchWithAuthJson(`/api/quotes?tickers=${tickers.join(",")}`),
    enabled: tickers.length > 0,
    refetchInterval: 60_000, // Re-fetch live quotes every 60s
  });

  const quotes = quotesData?.data ?? [];

  const handleDeleteHolding = async (holdingId: string) => {
    setDeleting(holdingId);
    try {
      const res = await fetchWithAuthJson(`/api/portfolio/${id}/holdings/${holdingId}`, {
        method: "DELETE",
      });
      if (res?.error) {
        toast.error(res.error ?? "Failed to remove holding.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["portfolio", id] });
      toast.success("Holding removed.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeletePortfolio = async () => {
    setDeletingPortfolio(true);
    try {
      const res = await fetchWithAuthJson(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res?.error) {
        toast.error(res.error ?? "Failed to delete portfolio.");
        return;
      }
      toast.success(`"${portfolio?.name}" deleted.`);
      await queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingPortfolio(false);
    }
  };

  if (portfolioLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Portfolio not found.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Go home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{portfolio.name}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            disabled={quotesLoading}
            onClick={() =>
              queryClient.refetchQueries({ queryKey: ["quotes", tickers.join(",")] })
            }
            title="Refresh quotes"
          >
            <RefreshCw className={`h-4 w-4 ${quotesLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                />
              }
            >
              <Trash2 className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete portfolio</DialogTitle>
                <DialogDescription>
                  This will permanently delete &ldquo;{portfolio.name}&rdquo; and all its
                  holdings. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDeletePortfolio}
                  disabled={deletingPortfolio}
                >
                  {deletingPortfolio ? "Deleting…" : "Delete portfolio"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P&L Summary */}
      <PnLSummaryCard
        holdings={portfolio.holdings}
        quotes={quotes}
        loading={quotesLoading}
      />

      <hr className="border-border" />

      {/* Your holdings */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Your holdings{" "}
          <span className="text-muted-foreground font-normal">
            ({portfolio.holdings.length})
          </span>
        </h2>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add holding
        </Button>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add holding</DialogTitle>
            <DialogDescription>
              Enter the ticker, number of shares, and your average cost per share.
            </DialogDescription>
          </DialogHeader>
          <AddHoldingForm
            portfolioId={id}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["portfolio", id] })
            }
            onClose={() => setAddOpen(false)}
            onLoadingChange={setAddLoading}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-holding-form" disabled={addLoading}>
              {addLoading ? "Adding…" : "Add holding"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <HoldingsTable
        holdings={portfolio.holdings}
        quotes={quotes}
        quotesLoading={quotesLoading}
        onDelete={handleDeleteHolding}
        deleting={deleting}
      />

      <hr className="border-border" />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceChart holdings={portfolio.holdings} quotes={quotes} />
        <AllocationChart holdings={portfolio.holdings} quotes={quotes} />
      </div>

      {/* AI Insights */}
      <InsightPanel portfolioId={id} />
    </div>
  );
}
