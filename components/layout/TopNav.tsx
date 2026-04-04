"use client";

import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthUser, Portfolio } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const TopNav = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: meData, isLoading: meLoading } = useQuery<{ data: { user: AuthUser } }>({
    queryKey: ["me"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
    },
    staleTime: 5 * 60 * 1000,
  });

  // Read portfolios directly from the cache — Sidebar owns the fetch.
  const portfoliosData = queryClient.getQueryData<{ data: Portfolio[] }>(["portfolios"]);

  const user = meData?.data?.user;

  // Derive breadcrumb from the current path.
  const portfolioIdMatch = pathname.match(/^\/portfolio\/([^/]+)/);
  const portfolioId = portfolioIdMatch?.[1];
  const portfolioName = portfolioId
    ? (portfoliosData?.data ?? []).find((p) => p.id === portfolioId)?.name
    : undefined;

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        {portfolioName && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{portfolioName}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {meLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {user.role}
            </Badge>
          </>
        ) : null}
      </div>
    </header>
  );
};
