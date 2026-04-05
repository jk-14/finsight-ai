"use client";

import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Menu } from "lucide-react";
import { fetchWithAuthJson } from "@/lib/auth-client";
import { useSignOut } from "@/hooks/use-sign-out";
import { AuthUser, Portfolio } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TopNavProps {
  onMenuClick: () => void;
}

export const TopNav = ({ onMenuClick }: TopNavProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const signOut = useSignOut();

  const { data: meData, isLoading: meLoading } = useQuery<{ data: { user: AuthUser } }>({
    queryKey: ["me"],
    queryFn: () => fetchWithAuthJson("/api/auth/me"),
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
    <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-background border-b border-border md:border-b-0 sticky top-0 z-10">
      <div className="flex items-center gap-3 text-sm">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
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
            <PopoverContent align="end" className="w-56 p-0 overflow-hidden">
              <div className="px-4 py-3 border-border">
                <p className="text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </header>
  );
};
