"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, LayoutGrid, Map as MapIcon, X } from "lucide-react";
import { getListings, getMeta, type Listing, type Meta } from "@/lib/api";
import type { TKey } from "@/lib/i18n";
import { num, price } from "@/lib/format";
import { useApp } from "@/components/providers";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { Skeleton } from "@/components/ui";

const SORTS = ["newest", "price_asc", "price_desc", "area_desc", "ppm_asc", "trust_desc"] as const;

function MapPanel({ items }: { items: Listing[] }) {
  const { locale } = useApp();
  const [active, setActive] = useState<string | null>(null);
  const bounds = useMemo(() => {
    const lats = items.map((i) => i.lat), lngs = items.map((i) => i.lng);
    return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
  }, [items]);
  if (!items.length) return null;

  return (
    <div className="surface relative h-[70vh] overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_30%_20%,rgba(244,63,94,.12),transparent_60%),radial-gradient(50rem_35rem_at_75%_70%,rgba(124,92,255,.14),transparent_60%)]" />
      {items.map((l) => {
        const x = ((l.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 84 + 8;
        const y = (1 - (l.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 80 + 8;
        const on = active === l.id;
        return (
          <button
            key={l.id}
            onClick={() => setActive(on ? null : l.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg transition ${
              on ? "z-20 scale-110 bg-white text-brand-700" : "z-10 bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white hover:scale-110"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {price(l.deal === "rent" ? l.rent_monthly : l.price, locale)}
          </button>
        );
      })}
      {active && (() => {
        const l = items.find((i) => i.id === active)!;
        return (
          <Link href={`/listing/${l.id}`} className="absolute bottom-4 start-4 end-4 z-30 flex gap-3 rounded-2xl surface p-3 sm:w-80 sm:end-auto">
            <img src={l.images[0]} alt="" className="h-16 w-20 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{locale === "fa" ? l.title_fa : l.title_en}</p>
              <p className="truncate text-xs muted">{locale === "fa" ? l.district_fa : l.district_en}</p>
              <p className="mt-1 text-sm font-black gradient-text">{price(l.price, locale)}</p>
            </div>
          </Link>
        );
      })()}
    </div>
  );
}

function SearchInner() {
  const { t, locale } = useApp();
  const router = useRouter();
  const sp = useSearchParams();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [data, setData] = useState<{ total: number; pages: number; items: Listing[]; avg_price_per_m: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "map">("list");
  const [openFilters, setOpenFilters] = useState(false);

  const params = useMemo(() => Object.fromEntries(sp.entries()), [sp]);
  const page = Number(params.page ?? 1);

  const setParam = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === undefined || v === "" ? p.delete(k) : p.set(k, v)));
    if (!("page" in patch)) p.delete("page");
    router.push(`/search?${p.toString()}`);
  };

  useEffect(() => { getMeta().then(setMeta).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams(sp.toString());
    p.set("page_size", "12");
    getListings(p.toString())
      .then(setData)
      .catch(() => setData({ total: 0, pages: 1, items: [], avg_price_per_m: 0 }))
      .finally(() => setLoading(false));
  }, [sp]);

  const districts = meta?.cities.find((c) => c.slug === params.city)?.districts ?? [];
  const field = "w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500";

  const Filters = (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black">{t("filters")}</h3>
        <button onClick={() => router.push("/search")} className="text-xs font-bold text-brand-500">{t("reset")}</button>
      </div>

      <div className="flex gap-1.5">
        {([["", "all_deals"], ["sale", "for_sale"], ["rent", "for_rent"]] as const).map(([v, k]) => (
          <button key={k} onClick={() => setParam({ deal: v || undefined })} data-active={(params.deal ?? "") === v} className="chip flex-1 px-3 py-2 text-xs font-bold">
            {t(k)}
          </button>
        ))}
      </div>

      <label className="grid gap-1.5 text-xs font-semibold muted">
        {t("city")}
        <select className={field} value={params.city ?? ""} onChange={(e) => setParam({ city: e.target.value || undefined, district: undefined })}>
          <option value="">{t("all_deals")}</option>
          {meta?.cities.map((c) => <option key={c.slug} value={c.slug}>{locale === "fa" ? c.name_fa : c.name_en}</option>)}
        </select>
      </label>

      {districts.length > 0 && (
        <label className="grid gap-1.5 text-xs font-semibold muted">
          {t("district")}
          <select className={field} value={params.district ?? ""} onChange={(e) => setParam({ district: e.target.value || undefined })}>
            <option value="">{t("all_deals")}</option>
            {districts.map((d) => <option key={d.en} value={d.en}>{locale === "fa" ? d.fa : d.en}</option>)}
          </select>
        </label>
      )}

      <label className="grid gap-1.5 text-xs font-semibold muted">
        {t("type")}
        <select className={field} value={params.type ?? ""} onChange={(e) => setParam({ type: e.target.value || undefined })}>
          <option value="">{t("all_deals")}</option>
          {meta?.property_types.map((p) => <option key={p.key} value={p.key}>{locale === "fa" ? p.fa : p.en}</option>)}
        </select>
      </label>

      <div className="grid gap-1.5 text-xs font-semibold muted">
        {t("beds")}
        <div className="flex gap-1.5">
          {["", "1", "2", "3", "4"].map((b) => (
            <button key={b} onClick={() => setParam({ beds: b || undefined })} data-active={(params.beds ?? "") === b} className="chip flex-1 py-2 text-xs font-bold">
              {b ? `${num(Number(b), locale)}+` : t("all_deals")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1.5 text-xs font-semibold muted">
          {locale === "fa" ? "کمینه متراژ" : "Min area"}
          <input type="number" className={field} value={params.min_area ?? ""} onChange={(e) => setParam({ min_area: e.target.value })} />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold muted">
          {locale === "fa" ? "بیشینه متراژ" : "Max area"}
          <input type="number" className={field} value={params.max_area ?? ""} onChange={(e) => setParam({ max_area: e.target.value })} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1.5 text-xs font-semibold muted">
          {locale === "fa" ? "از (میلیون)" : "Min (M)"}
          <input type="number" className={field} value={params.min_price ?? ""} onChange={(e) => setParam({ min_price: e.target.value })} />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold muted">
          {locale === "fa" ? "تا (میلیون)" : "Max (M)"}
          <input type="number" className={field} value={params.max_price ?? ""} onChange={(e) => setParam({ max_price: e.target.value })} />
        </label>
      </div>

      <div className="grid gap-2">
        {([["verified", "verified_only"], ["tour360", "tour_only"]] as const).map(([k, label]) => (
          <label key={k} className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold">
            <input
              type="checkbox"
              checked={params[k] === "true"}
              onChange={(e) => setParam({ [k]: e.target.checked ? "true" : undefined })}
              className="h-4 w-4 accent-brand-600"
            />
            {t(label)}
          </label>
        ))}
      </div>

      {meta && (
        <div className="grid gap-1.5 text-xs font-semibold muted">
          {t("amenities")}
          <div className="flex flex-wrap gap-1.5">
            {meta.amenities.map((a) => {
              const sel = (params.amenities ?? "").split(",").filter(Boolean);
              const on = sel.includes(a.key);
              return (
                <button
                  key={a.key}
                  data-active={on}
                  onClick={() => setParam({ amenities: (on ? sel.filter((x) => x !== a.key) : [...sel, a.key]).join(",") || undefined })}
                  className="chip px-3 py-1.5 text-[11px] font-bold"
                >
                  {locale === "fa" ? a.fa : a.en}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SearchBar compact />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold">
          {loading ? t("loading") : <>{num(data?.total ?? 0, locale)} {t("results")}</>}
          {data && data.total > 0 && (
            <span className="ms-2 text-xs font-normal muted">
              · {locale === "fa" ? "میانگین" : "avg"} {num(data.avg_price_per_m, locale)} {locale === "fa" ? "م/متر" : "M/m²"}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenFilters(true)} className="flex items-center gap-2 rounded-2xl surface px-4 py-2.5 text-xs font-bold lg:hidden">
            <Filter size={14} /> {t("filters")}
          </button>
          <div className="flex gap-1 rounded-2xl surface p-1">
            <button onClick={() => setView("list")} data-active={view === "list"} className="chip px-3 py-1.5 text-xs font-bold">
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setView("map")} data-active={view === "map"} className="chip px-3 py-1.5 text-xs font-bold">
              <MapIcon size={14} />
            </button>
          </div>
          <select value={params.sort ?? "newest"} onChange={(e) => setParam({ sort: e.target.value })} className="rounded-2xl surface px-4 py-2.5 text-xs font-bold outline-none">
            {SORTS.map((s) => <option key={s} value={s}>{t(`sort_${s}` as TKey)}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-24 hidden h-fit rounded-3xl surface p-5 lg:block">{Filters}</aside>

        <div>
          {view === "map" && data ? (
            <MapPanel items={data.items} />
          ) : loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
            </div>
          ) : data && data.items.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.items.map((l, i) => <ListingCard key={l.id} item={l} index={i} />)}
            </div>
          ) : (
            <div className="grid place-items-center rounded-3xl surface p-16 text-center">
              <p className="text-lg font-bold">{t("no_results")}</p>
              <p className="mt-2 text-sm muted">{t("no_results_sub")}</p>
            </div>
          )}

          {data && data.pages > 1 && view === "list" && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })} className="grid h-10 w-10 place-items-center rounded-full surface disabled:opacity-40">
                <ChevronRight size={16} className="rtl:hidden" /><ChevronLeft size={16} className="ltr:hidden" />
              </button>
              {Array.from({ length: Math.min(5, data.pages) }).map((_, i) => {
                const n = i + 1;
                return (
                  <button key={n} onClick={() => setParam({ page: String(n) })} data-active={n === page} className="chip h-10 w-10 text-xs font-bold">
                    {num(n, locale)}
                  </button>
                );
              })}
              <button disabled={page >= data.pages} onClick={() => setParam({ page: String(page + 1) })} className="grid h-10 w-10 place-items-center rounded-full surface disabled:opacity-40">
                <ChevronLeft size={16} className="rtl:hidden" /><ChevronRight size={16} className="ltr:hidden" />
              </button>
            </div>
          )}
        </div>
      </div>

      {openFilters && (
        <div className="fixed inset-0 z-[60] bg-black/50 lg:hidden" onClick={() => setOpenFilters(false)}>
          <div className="absolute bottom-0 start-0 end-0 max-h-[85vh] overflow-y-auto rounded-t-3xl surface-solid p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenFilters(false)} className="absolute end-5 top-5 grid h-9 w-9 place-items-center rounded-full surface"><X size={16} /></button>
            {Filters}
            <button onClick={() => setOpenFilters(false)} className="glow-btn mt-6 w-full rounded-2xl py-3 text-sm font-bold">{t("apply")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-10"><Skeleton className="h-96" /></div>}>
      <SearchInner />
    </Suspense>
  );
}
