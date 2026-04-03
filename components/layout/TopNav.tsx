"use client";

import { useQuery } from "@tanstack/react-query";
import { AuthUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface TopNavProps {
  portfolioName?: string;
}

export const TopNav = ({ portfolioName }: TopNavProps) => {
  const { data, isLoading } = useQuery<{ data: { user: AuthUser } }>({
    queryKey: ["me"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
    },
    staleTime: 5 * 60 * 1000, // user info is stable — only fetch once every 5 min
  });

  const user = data?.data?.user;

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
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
        {isLoading ? (
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
