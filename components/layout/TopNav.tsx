"use client";

import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthUser, Portfolio } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

      <div className="flex items-center">
        {meLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <Popover>
            <PopoverTrigger
              nativeButton={false}
              render={
                <Avatar className="h-8 w-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full" />
              }
            >
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                {(user.firstName[0] + user.lastName[0]).toUpperCase()}
              </AvatarFallback>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Role
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </header>
  );
};
