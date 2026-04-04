"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TickerEntry } from "@/lib/tickers";

interface Props {
  value: string;
  onSelect: (ticker: string) => void;
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function fetchWithAuth(url: string) {
  const token = localStorage.getItem("token");
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) =>
    r.json()
  );
}

export const TickerSearch = ({ value, onSelect }: Props) => {
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(inputValue, 300);

  const { data, isFetching } = useQuery<{ data: TickerEntry[] }>({
    queryKey: ["tickers", debouncedQuery],
    queryFn: () => fetchWithAuth(`/api/tickers?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 60 * 1000, // ticker names don't change — cache for 1 min
  });

  const results = data?.data ?? [];

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (entry: TickerEntry) => {
    setInputValue(entry.ticker);
    onSelect(entry.ticker);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id="ticker"
          placeholder="Search ticker or company…"
          value={inputValue}
          autoComplete="off"
          required
          onChange={(e) => {
            setInputValue(e.target.value.toUpperCase());
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (inputValue.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="uppercase pr-8"
        />
        {isFetching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-[var(--btn-radius)] border border-border bg-card shadow-md overflow-hidden"
        >
          {results.map((entry, index) => (
            <li
              key={entry.ticker}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur before click registers
                handleSelect(entry);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors",
                index === activeIndex
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <span className="font-mono font-semibold">{entry.ticker}</span>
              <span
                className={cn(
                  "text-xs truncate ml-3 max-w-[60%] text-right",
                  index === activeIndex
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {entry.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
