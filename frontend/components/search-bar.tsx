"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "./providers";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { t } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [deal, setDeal] = useState<"sale" | "rent" | "">("sale");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (deal) p.set("deal", deal);
    router.push(`/search?${p.toString()}`);
  };

  return (
    <form onSubmit={submit} className={`surface w-full rounded-3xl p-2 ${compact ? "" : "sm:p-3"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-2xl bg-[color:var(--glass)] p-1">
          {([["sale", "for_sale"], ["rent", "for_rent"]] as const).map(([v, k]) => (
            <button
              key={v}
              type="button"
              onClick={() => setDeal(v)}
              data-active={deal === v}
              className="chip px-4 py-2 text-xs font-bold"
            >
              {t(k)}
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search size={18} className="shrink-0 muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_ph")}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[color:var(--fg-muted)]"
          />
        </div>
        <button type="submit" className="glow-btn flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold">
          <SlidersHorizontal size={16} />
          {t("search")}
        </button>
      </div>
    </form>
  );
}
