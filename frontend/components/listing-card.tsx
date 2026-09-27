"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Bath, Bed, Flame, Heart, Maximize, Scan } from "lucide-react";
import type { Listing } from "@/lib/api";
import { num, price, ppm } from "@/lib/format";
import { useApp } from "./providers";

export function ListingCard({ item, index = 0 }: { item: Listing; index?: number }) {
  const { t, locale, favorites, toggleFavorite } = useApp();
  const [img, setImg] = useState(0);
  const fav = favorites.includes(item.id);
  const title = locale === "fa" ? item.title_fa : item.title_en;
  const place = locale === "fa"
    ? `${item.district_fa}، ${item.city_fa}`
    : `${item.district_en}, ${item.city_en}`;

  return (
    <article
      className="group surface lift overflow-hidden rounded-3xl"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Link href={`/listing/${item.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={item.images[img]}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ background: "linear-gradient(135deg,#1f2440,#3b2a4f)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {item.deal === "sale" ? t("for_sale") : t("for_rent")}
          </span>
          {item.verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
              <BadgeCheck size={12} /> {t("verified")}
            </span>
          )}
          {item.tour360 && (
            <span className="flex items-center gap-1 rounded-full bg-[color:var(--color-violet-glow)]/90 px-2.5 py-1 text-[11px] font-bold text-white">
              <Scan size={12} /> {locale === "fa" ? "۳۶۰" : "360"}
            </span>
          )}
          {item.hot && (
            <span className="flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
              <Flame size={12} /> {t("hot")}
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
          aria-label={t("favorites")}
          className="absolute top-3 end-3 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:scale-110"
        >
          <Heart size={16} fill={fav ? "#f43f5e" : "none"} color={fav ? "#f43f5e" : "currentColor"} />
        </button>

        <div className="absolute bottom-3 start-3 end-3 flex items-end justify-between gap-2">
          <div className="text-white">
            <p className="text-lg font-extrabold drop-shadow">
              {item.deal === "rent"
                ? `${price(item.rent_monthly, locale)} / ${locale === "fa" ? "ماه" : "mo"}`
                : price(item.price, locale)}
            </p>
            <p className="text-[11px] opacity-80">{ppm(item.price_per_m, locale)}</p>
          </div>
          <div className="flex gap-1">
            {item.images.slice(0, 4).map((_, i) => (
              <span
                key={i}
                onMouseEnter={() => setImg(i)}
                className={`h-1.5 w-5 rounded-full transition-all ${i === img ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/listing/${item.id}`}>
          <h3 className="truncate text-sm font-bold">{title}</h3>
        </Link>
        <p className="mt-1 truncate text-xs muted">{place}</p>
        <div className="mt-3 flex items-center gap-4 border-t border-[color:var(--line)] pt-3 text-xs muted">
          <span className="flex items-center gap-1.5"><Bed size={14} /> {num(item.beds, locale)}</span>
          <span className="flex items-center gap-1.5"><Bath size={14} /> {num(item.baths, locale)}</span>
          <span className="flex items-center gap-1.5"><Maximize size={14} /> {num(item.area, locale)} {locale === "fa" ? "متر" : "m²"}</span>
          <span className="ms-auto font-semibold text-emerald-500">{num(item.trust_score, locale)}{locale === "fa" ? "٪" : "%"}</span>
        </div>
      </div>
    </article>
  );
}
