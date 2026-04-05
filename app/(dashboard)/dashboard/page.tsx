"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuthJson } from "@/lib/auth-client";

export default function DashboardRootPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery<{ data: Portfolio[] }>({
    queryKey: ["portfolios"],
    queryFn: () => fetchWithAuthJson("/api/portfolio"),
  });

  useEffect(() => {
    if (!data) return;
    const portfolios = data.data ?? [];
    if (portfolios.length > 0) {
      router.replace(`/portfolio/${portfolios[0].id}`);
    } else {
      router.replace("/portfolio/new");
    }
  }, [data, router]);

  return (
    <div className="flex items-center justify-center h-full">
      {isLoading && <Skeleton className="h-8 w-48" />}
    </div>
  );
}
