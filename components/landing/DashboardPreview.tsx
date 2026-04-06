"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TABS = [
  {
    label: "Portfolio & P&L",
    src: "/screenshots/dashboard-overview-v1.png",
    alt: "Portfolio dashboard showing P&L summary cards and holdings table with live prices",
  },
  {
    label: "Charts & AI Insights",
    src: "/screenshots/dashboard-charts-v1.png",
    alt: "Dashboard showing 30-day performance chart, allocation donut chart, and Claude AI portfolio commentary",
  },
];

export const DashboardPreview = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tab switcher */}
      <div className="flex justify-center gap-1 mb-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              active === i
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browser chrome frame */}
      <div className="rounded-xl border border-border shadow-2xl overflow-hidden bg-muted">
        {/* Chrome top bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <div className="ml-2 flex-1 bg-background/70 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono truncate">
            finsight-ai-xi-sandy.vercel.app/portfolio
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative w-full aspect-[1440/860] overflow-hidden">
          {TABS.map((tab, i) => (
            <Image
              key={tab.src}
              src={tab.src}
              alt={tab.alt}
              width={1440}
              height={860}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 3rem), 1000px"
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-0"
              )}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
