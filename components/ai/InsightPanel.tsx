"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InsightSkeleton } from "./InsightSkeleton";

interface InsightData {
  data: {
    insight: string | null;
    generatedAt?: string;
  };
}

interface Props {
  portfolioId: string;
}

function renderInsight(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return paragraphs.map((para, i) => {
    // Match **Heading:** body  or  **Heading** body
    const match = para.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)/);
    if (match) {
      const [, heading, body] = match;
      return (
        <div key={i} className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{heading}</p>
          {body.trim() && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {body.trim()}
            </p>
          )}
        </div>
      );
    }
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed">
        {para.trim()}
      </p>
    );
  });
}

export const InsightPanel = ({ portfolioId }: Props) => {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const { data, isLoading } = useQuery<InsightData>({
    queryKey: ["insight", portfolioId],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch(`/api/ai-insights/${portfolioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
    },
  });

  const insight = data?.data?.insight;
  const generatedAt = data?.data?.generatedAt;

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/ai-insights/${portfolioId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        setGenError(json.error ?? "Failed to generate insight");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["insight", portfolioId] });
    } catch {
      setGenError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) return <InsightSkeleton />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">AI Insight</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />
            {insight ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {genError && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md mb-3">
            {genError}
          </p>
        )}

        {generating ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>Claude is analyzing your portfolio&hellip;</span>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ) : insight ? (
          <div className="space-y-3">
            {renderInsight(insight)}
            {generatedAt && (
              <p className="text-xs text-muted-foreground pt-1">
                Generated{" "}
                {new Date(generatedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No insight yet. Click &ldquo;Generate&rdquo; to get Claude&apos;s analysis of
            your portfolio.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
