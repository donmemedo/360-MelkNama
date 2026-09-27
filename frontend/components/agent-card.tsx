"use client";

import { Award, Phone, Star } from "lucide-react";
import type { Agent } from "@/lib/api";
import { num } from "@/lib/format";
import { useApp } from "./providers";

export function AgentCard({ a }: { a: Agent }) {
  const { t, locale } = useApp();
  return (
    <div className="surface lift rounded-3xl p-5 text-center">
      <div className="relative mx-auto h-20 w-20">
        <img src={a.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-500/50" />
        <span className="absolute -bottom-1 -end-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
          <Award size={14} />
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold">{locale === "fa" ? a.name_fa : a.name_en}</h3>
      <p className="text-xs muted">{locale === "fa" ? a.specialty_fa : a.specialty_en}</p>
      <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-500">
        <Star size={13} fill="currentColor" /> {num(a.rating, locale)}
        <span className="muted font-normal">({num(a.reviews, locale)} {t("reviews")})</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1 border-t border-[color:var(--line)] pt-4 text-[11px] muted">
        <div><b className="block text-sm text-[color:var(--fg)]">{num(a.deals, locale)}</b>{t("deals")}</div>
        <div><b className="block text-sm text-[color:var(--fg)]">{num(a.years, locale)}</b>{t("years_exp")}</div>
        <div><b className="block text-sm text-[color:var(--fg)]">{num(a.active_listings ?? 0, locale)}</b>{t("active_listings")}</div>
      </div>
      <a href={`tel:${a.phone}`} className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--line)] py-2.5 text-xs font-bold transition hover:border-brand-500 hover:text-brand-500">
        <Phone size={14} /> {t("contact_agent")}
      </a>
    </div>
  );
}
