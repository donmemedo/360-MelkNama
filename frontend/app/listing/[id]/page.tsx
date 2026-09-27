"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Bath, Bed, Building, Calendar, Car, Eye, Footprints, Heart,
  Maximize, Scan, Share2, Star, TrainFront, TrendingDown, TrendingUp,
} from "lucide-react";
import { getListing, type Listing } from "@/lib/api";
import { dateStr, num, price, ppm } from "@/lib/format";
import { useApp } from "@/components/providers";
import { ListingCard } from "@/components/listing-card";
import { LeadForm } from "@/components/lead-form";
import { Skeleton } from "@/components/ui";

function PriceHistory({ data }: { data: Listing["price_history"] }) {
  const vals = data.map((d) => d.price);
  const min = Math.min(...vals) * 0.99, max = Math.max(...vals) * 1.01;
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * 100, 100 - ((v - min) / (max - min || 1)) * 100] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-28 w-full">
      <defs>
        <linearGradient id="ph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity=".4" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L100,100 L0,100 Z`} fill="url(#ph)" />
      <path d={line} fill="none" stroke="var(--color-brand-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale, favorites, toggleFavorite } = useApp();
  const [item, setItem] = useState<Listing | null>(null);
  const [active, setActive] = useState(0);
  const [err, setErr] = useState(false);

  useEffect(() => { getListing(id).then(setItem).catch(() => setErr(true)); }, [id]);

  if (err) return <div className="mx-auto max-w-3xl p-20 text-center"><p className="text-lg font-bold">{t("no_results")}</p><Link href="/search" className="mt-4 inline-block text-sm font-bold text-brand-500">{t("back")}</Link></div>;
  if (!item) return <div className="mx-auto max-w-7xl space-y-4 p-6"><Skeleton className="h-[52vh]" /><Skeleton className="h-64" /></div>;

  const fav = favorites.includes(item.id);
  const title = locale === "fa" ? item.title_fa : item.title_en;
  const address = locale === "fa" ? item.address_fa : item.address_en;
  const up = item.estimate_delta >= 0;

  const facts = [
    { icon: Bed, label: t("beds"), value: num(item.beds, locale) },
    { icon: Bath, label: t("baths"), value: num(item.baths, locale) },
    { icon: Maximize, label: t("area"), value: `${num(item.area, locale)} ${locale === "fa" ? "متر" : "m²"}` },
    { icon: Car, label: t("parking"), value: num(item.parking, locale) },
    { icon: Building, label: t("floor"), value: num(item.floor, locale) },
    { icon: Calendar, label: t("year_built"), value: num(item.year_built, locale) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Gallery */}
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="relative overflow-hidden rounded-3xl sm:col-span-3 sm:row-span-2">
          <img src={item.images[active]} alt={title} className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto" />
          <div className="absolute top-4 start-4 flex flex-wrap gap-2">
            {item.verified && <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white"><BadgeCheck size={13} /> {t("verified")}</span>}
            {item.tour360 && <span className="flex items-center gap-1 rounded-full bg-[color:var(--color-violet-glow)] px-3 py-1 text-xs font-bold text-white"><Scan size={13} /> {t("tour360")}</span>}
          </div>
          <div className="absolute top-4 end-4 flex gap-2">
            <button onClick={() => toggleFavorite(item.id)} className="grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur">
              <Heart size={17} fill={fav ? "#f43f5e" : "none"} color={fav ? "#f43f5e" : "currentColor"} />
            </button>
            <button
              onClick={() => navigator.share?.({ title, url: location.href }).catch(() => {})}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:col-span-1 sm:grid-cols-1 sm:grid-rows-4">
          {item.images.slice(0, 4).map((src, i) => (
            <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-2xl ring-2 transition ${i === active ? "ring-brand-500" : "ring-transparent"}`}>
              <img src={src} alt="" className="aspect-[4/3] h-full w-full object-cover transition hover:scale-105" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="surface rounded-3xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>
                <p className="mt-2 text-sm muted">{address}</p>
              </div>
              <div className="text-end">
                <p className="text-2xl font-black gradient-text sm:text-3xl">
                  {item.deal === "rent" ? price(item.rent_monthly, locale) : price(item.price, locale)}
                </p>
                <p className="text-xs muted">
                  {item.deal === "rent"
                    ? `${t("deposit")}: ${price(item.rent_deposit, locale)}`
                    : ppm(item.price_per_m, locale)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[color:var(--line)] pt-5 sm:grid-cols-6">
              {facts.map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon size={18} className="mx-auto text-brand-500" />
                  <p className="mt-1.5 text-sm font-bold">{f.value}</p>
                  <p className="text-[11px] muted">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-3xl p-6">
            <h2 className="text-lg font-black">{t("description")}</h2>
            <p className="mt-3 text-sm leading-8 muted">{locale === "fa" ? item.desc_fa : item.desc_en}</p>
            <h3 className="mt-6 text-sm font-black">{t("amenities")}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.amenities.map((a) => (
                <span key={a.key} className="rounded-full border border-[color:var(--line)] px-3.5 py-1.5 text-xs font-semibold">
                  {locale === "fa" ? a.fa : a.en}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface rounded-3xl p-6">
              <h2 className="text-lg font-black">{t("estimate_title")}</h2>
              <p className="mt-3 text-2xl font-black">{price(item.estimate, locale)}</p>
              <p className={`mt-1 flex items-center gap-1 text-xs font-bold ${up ? "text-emerald-500" : "text-brand-500"}`} dir="ltr">
                {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {up ? "+" : ""}{num(item.estimate_delta, locale)}%
              </p>
              <PriceHistory data={item.price_history} />
            </div>
            <div className="surface rounded-3xl p-6">
              <h2 className="text-lg font-black">{t("trust_score")}</h2>
              <div className="mt-4 space-y-4">
                {[
                  { icon: BadgeCheck, label: t("trust_score"), v: item.trust_score },
                  { icon: Footprints, label: t("walk_score"), v: item.walk_score },
                  { icon: TrainFront, label: t("transit_score"), v: item.transit_score },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold"><s.icon size={14} /> {s.label}</span>
                      <span className="font-bold">{num(s.v, locale)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--line)]">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-[color:var(--color-aqua-glow)]" style={{ width: `${s.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[color:var(--line)] pt-4 text-xs muted">
                <span className="flex items-center gap-1.5"><Eye size={14} /> {num(item.views, locale)}</span>
                <span className="flex items-center gap-1.5"><Heart size={14} /> {num(item.saves, locale)}</span>
                <span>{num(item.days_on_market, locale)} {t("days_on_market")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          {item.agent && (
            <div className="surface rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <img src={item.agent.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500/50" />
                <div>
                  <p className="text-sm font-bold">{locale === "fa" ? item.agent.name_fa : item.agent.name_en}</p>
                  <p className="flex items-center gap-1 text-xs text-amber-500">
                    <Star size={12} fill="currentColor" /> {num(item.agent.rating, locale)}
                    <span className="muted">({num(item.agent.reviews, locale)})</span>
                  </p>
                  <p className="text-[11px] muted" dir="ltr">{item.agent.license}</p>
                </div>
              </div>
              <div className="mt-5"><LeadForm listingId={item.id} /></div>
            </div>
          )}
          <div className="surface rounded-3xl p-6 text-xs muted">
            <p><b className="text-[color:var(--fg)]">{t("listed")}:</b> {dateStr(item.listed_at, locale)}</p>
            <p className="mt-2"><b className="text-[color:var(--fg)]">{t("type")}:</b> {locale === "fa" ? item.type_fa : item.type_en}</p>
            <p className="mt-2" dir="ltr"><b className="text-[color:var(--fg)]">ID:</b> {item.id}</p>
            {item.open_house && <p className="mt-2"><b className="text-[color:var(--fg)]">{t("open_house")}:</b> {dateStr(item.open_house, locale)}</p>}
          </div>
        </aside>
      </div>

      {!!item.similar?.length && (
        <section className="mt-14">
          <h2 className="text-2xl font-black">{t("similar")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {item.similar.map((l, i) => <ListingCard key={l.id} item={l} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
