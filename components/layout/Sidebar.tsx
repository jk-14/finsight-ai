"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, LogOut, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Portfolio } from "@/types";

function fetchWithAuth(url: string) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: Portfolio[] }>({
    queryKey: ["portfolios"],
    queryFn: () => fetchWithAuth("/api/portfolio"),
  });

  const portfolios = data?.data ?? [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    router.push("/login");
  };

  return (
    <aside className="flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-14 px-5 border-b border-border shrink-0">
        <img src="/icons/finsight-mark-32.svg" alt="FinSight AI" width={32} height={32} />
        <span className="font-bold text-base tracking-tight">FinSight AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Portfolios
        </p>

        {isLoading ? (
          <div className="space-y-2 px-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : portfolios.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">No portfolios yet</p>
        ) : (
          portfolios.map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.id}`}
              className={cn(
                "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors",
                pathname === `/portfolio/${p.id}`
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span className="truncate">{p.name}</span>
            </Link>
          ))
        )}

        <Link
          href="/portfolio/new"
          className={cn(
            "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors mt-2",
            pathname === "/portfolio/new"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span>New Portfolio</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
};
