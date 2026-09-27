"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, LineChart, Scan, ShieldCheck, Users } from "lucide-react";
import { getAgents, getListings, getMarket, type Agent, type Listing, type Market } from "@/lib/api";
import { num, price } from "@/lib/format";
import { useApp } from "@/components/providers";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { AgentCard } from "@/components/agent-card";
import { EstimateWidget } from "@/components/estimate";
import { DistrictBars, TrendChart } from "@/components/market-chart";
import { CountUp, Reveal, Skeleton } from "@/components/ui";

export default function HomePage() {
  const { t, locale, dir } = useApp();
  const [featured, setFeatured] = useState<Listing[] | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    getListings("sort=trust_desc&verified=true&page_size=8").then((r) => setFeatured(r.items)).catch(() => setFeatured([]));
    getMarket("tehran").then(setMarket).catch(() => {});
    getAgents().then((r) => setAgents(r.items.slice(0, 4))).catch(() => {});
  }, []);

  const stats = [
    { icon: Building2, value: market?.total_listings ?? 0, label: t("stat_listings"), suffix: "" },
    { icon: BadgeCheck, value: (market?.verified_ratio ?? 0) * 100, label: t("stat_verified"), suffix: "%" },
    { icon: Scan, value: (market?.tour_ratio ?? 0) * 100, label: t("stat_tours"), suffix: "%" },
    { icon: Users, value: 8, label: t("stat_agents"), suffix: "" },
  ];

  const features = [
    { icon: LineChart, t: "f1_t", d: "f1_d" },
    { icon: ShieldCheck, t: "f2_t", d: "f2_d" },
    { icon: Scan, t: "f3_t", d: "f3_d" },
    { icon: Users, t: "f4_t", d: "f4_d" },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full surface px-4 py-1.5 text-xs font-bold">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                {t("hero_kicker")}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-[2.6rem] font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
                {t("hero_title_1")}{" "}
                <span className="gradient-text">{t("hero_title_2")}</span>{" "}
                {t("hero_title_3")}
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 max-w-xl text-base leading-8 muted sm:text-lg">{t("hero_sub")}</p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-8">
                <SearchBar />
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/search" className="glow-btn flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold">
                  {t("cta_explore")} <Arrow size={16} />
                </Link>
                <Link href="/sell" className="rounded-2xl surface px-6 py-3 text-sm font-bold transition hover:text-brand-500">
                  {t("cta_estimate")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] surface sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 start-5 end-5 surface rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] muted">{t("median_price")} · {locale === "fa" ? "تهران" : "Tehran"}</p>
                    <p className="text-lg font-extrabold gradient-text">
                      {market ? price(market.median_price, locale) : "—"}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-[11px] muted">{t("avg_dom")}</p>
                    <p className="text-lg font-extrabold">
                      {market ? num(market.avg_days_on_market, locale) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-6 -start-6 hidden rounded-2xl surface px-4 py-3 text-xs font-bold sm:block">
              <span className="flex items-center gap-2 text-emerald-500"><BadgeCheck size={15} /> {t("verified")}</span>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="surface lift rounded-3xl p-5">
                <s.icon size={20} className="text-brand-500" />
                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  <CountUp to={s.value} format={(v) => num(v, locale)} />
                  {s.suffix}
                </p>
                <p className="mt-1 text-xs muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-black sm:text-4xl">{t("features_title")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 80}>
              <div className="surface lift h-full rounded-3xl p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white">
                  <f.icon size={22} />
                </span>
                <h3 className="mt-4 text-base font-bold">{t(f.t)}</h3>
                <p className="mt-2 text-sm leading-7 muted">{t(f.d)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">{t("featured")}</h2>
            <p className="mt-2 text-sm muted">{t("featured_sub")}</p>
          </div>
          <Link href="/search" className="flex items-center gap-2 rounded-2xl surface px-5 py-2.5 text-sm font-bold transition hover:text-brand-500">
            {t("see_all")} <Arrow size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured
            ? featured.map((l, i) => (
                <Reveal key={l.id} delay={i * 60}>
                  <ListingCard item={l} index={i} />
                </Reveal>
              ))
            : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      </section>

      {/* Market pulse */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="surface grid gap-8 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black">{t("market_title")}</h2>
              <p className="mt-2 text-sm muted">{t("market_sub")}</p>
              <div className="mt-6">{market ? <DistrictBars data={market.districts} /> : <Skeleton className="h-48" />}</div>
            </div>
            <div className="rounded-[1.5rem] bg-gradient-to-br from-brand-600/10 to-[color:var(--color-violet-glow)]/10 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs muted">{t("median_price")}</p>
                  <p className="text-xl font-black">{market ? price(market.median_price, locale) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs muted">{t("per_meter")}</p>
                  <p className="text-xl font-black">{market ? num(market.avg_price_per_m, locale) : "—"}</p>
                </div>
              </div>
              <div className="mt-6">{market ? <TrendChart data={market.trend} /> : <Skeleton className="h-32" />}</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Estimate */}
      <section id="estimate" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal><EstimateWidget /></Reveal>
      </section>

      {/* Agents */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">{t("agents_title")}</h2>
            <p className="mt-2 text-sm muted">{t("agents_sub")}</p>
          </div>
          <Link href="/agents" className="flex items-center gap-2 rounded-2xl surface px-5 py-2.5 text-sm font-bold transition hover:text-brand-500">
            {t("see_all")} <Arrow size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents
            ? agents.map((a, i) => (
                <Reveal key={a.id} delay={i * 70}><AgentCard a={a} /></Reveal>
              ))
            : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-[color:var(--color-violet-glow)] to-[color:var(--color-aqua-glow)] p-10 text-center text-white sm:p-16">
            <h2 className="text-3xl font-black sm:text-5xl">{t("tagline")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm opacity-90 sm:text-base">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/search" className="rounded-2xl bg-white px-7 py-3 text-sm font-black text-brand-700 transition hover:scale-105">
                {t("cta_explore")}
              </Link>
              <Link href="/sell" className="rounded-2xl border border-white/60 px-7 py-3 text-sm font-black transition hover:bg-white/15">
                {t("nav_sell")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
