"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [inputValue, setInputValue] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(inputValue, 300);

  const { data, isFetching } = useQuery<{ data: TickerEntry[] }>({
    queryKey: ["tickers", debouncedQuery],
    queryFn: () => fetchWithAuth(`/api/tickers?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 60 * 1000,
  });

  const results = data?.data ?? [];
  const isDebouncing = inputValue.trim() !== debouncedQuery.trim();
  const isLoading = isDebouncing || isFetching;

  return (
    <Combobox
      value={value}
      onValueChange={(v) => {
        if (v) {
          onSelect(v);
          setInputValue("");
        }
      }}
      filter={() => true}
      open={inputValue.trim().length >= 1}
    >
      <div ref={anchorRef} className="w-full">
        <ComboboxInput
          placeholder="Search ticker or company…"
          showClear
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <ComboboxContent anchor={anchorRef} sideOffset={2} className="shadow-xl">
        <ComboboxList>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-1.5 py-1.5 gap-2"
              >
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))
          ) : results.length === 0 ? (
            <div className="py-3 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            results.map((entry) => (
              <ComboboxItem
                key={entry.ticker}
                value={entry.ticker}
                className="justify-between pr-2"
                showIndicator={false}
              >
                <span className="font-mono font-semibold">{entry.ticker}</span>
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
