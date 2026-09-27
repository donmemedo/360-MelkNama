"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartCrack } from "lucide-react";
import { getListing, type Listing } from "@/lib/api";
import { useApp } from "@/components/providers";
import { ListingCard } from "@/components/listing-card";
import { Skeleton } from "@/components/ui";

export default function FavoritesPage() {
  const { t, favorites } = useApp();
  const [items, setItems] = useState<Listing[] | null>(null);

  useEffect(() => {
    if (!favorites.length) return setItems([]);
    Promise.all(favorites.map((id) => getListing(id).catch(() => null)))
      .then((r) => setItems(r.filter(Boolean) as Listing[]));
  }, [favorites]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black">{t("favorites")}</h1>
      <div className="mt-8">
        {!items ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80" />)}</div>
        ) : items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((l, i) => <ListingCard key={l.id} item={l} index={i} />)}</div>
        ) : (
          <div className="grid place-items-center rounded-3xl surface p-16 text-center">
            <HeartCrack size={36} className="muted" />
            <p className="mt-4 text-lg font-bold">{t("no_results")}</p>
            <Link href="/search" className="glow-btn mt-6 rounded-2xl px-6 py-3 text-sm font-bold">{t("cta_explore")}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
