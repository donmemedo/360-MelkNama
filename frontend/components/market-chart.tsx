"use client";

import type { Market } from "@/lib/api";
import { num } from "@/lib/format";
import { useApp } from "./providers";

export function TrendChart({ data }: { data: Market["trend"] }) {
  const { locale } = useApp();
  const vals = data.map((d) => d.avg_price_per_m);
  const min = Math.min(...vals) * 0.98;
  const max = Math.max(...vals) * 1.02;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min || 1)) * 100;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const growth = ((vals[vals.length - 1] - vals[0]) / (vals[0] || 1)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs muted">{locale === "fa" ? "روند ۱۲ ماه اخیر" : "Last 12 months"}</span>
        <span className={`text-sm font-bold ${growth >= 0 ? "text-emerald-500" : "text-brand-500"}`} dir="ltr">
          {growth >= 0 ? "+" : ""}{num(Math.abs(growth), locale)}%
        </span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-32 w-full overflow-visible">
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-violet-glow)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-brand-500)" />
            <stop offset="100%" stopColor="var(--color-aqua-glow)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tg)" />
        <path d={line} fill="none" stroke="url(#tl)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="var(--color-brand-500)" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  );
}

export function DistrictBars({ data }: { data: Market["districts"] }) {
  const { locale } = useApp();
  const top = data.slice(0, 6);
  const max = Math.max(...top.map((d) => d.avg_price_per_m));
  return (
    <ul className="space-y-3">
      {top.map((d, i) => (
        <li key={d.district_en}>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold">{locale === "fa" ? d.district_fa : d.district_en}</span>
            <span className="muted">{num(d.avg_price_per_m, locale)} {locale === "fa" ? "م/متر" : "M/m²"}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--line)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-[color:var(--color-violet-glow)] transition-all duration-1000"
              style={{ width: `${(d.avg_price_per_m / max) * 100}%`, transitionDelay: `${i * 80}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
