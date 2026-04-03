"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardRootPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery<{ data: Portfolio[] }>({
    queryKey: ["portfolios"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
    },
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
