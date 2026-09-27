"use client";

import { useEffect, useState } from "react";
import { Calculator, Sparkles } from "lucide-react";
import { getMeta, post, type Meta } from "@/lib/api";
import { num, price } from "@/lib/format";
import { useApp } from "./providers";

type Result = {
  price_per_m: number; value: number; range_low: number; range_high: number;
  confidence: number; district_en: string; district_fa: string;
};

export function EstimateWidget() {
  const { t, locale } = useApp();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [city, setCity] = useState("tehran");
  const [district, setDistrict] = useState("Vanak");
  const [area, setArea] = useState(110);
  const [beds, setBeds] = useState(2);
  const [year, setYear] = useState(1398);
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getMeta().then(setMeta).catch(() => {}); }, []);

  const districts = meta?.cities.find((c) => c.slug === city)?.districts ?? [];
  useEffect(() => {
    if (districts.length && !districts.some((d) => d.en === district)) setDistrict(districts[0].en);
  }, [city, districts, district]);

  const run = async () => {
    setBusy(true);
    try {
      setRes(await post<Result>("/api/estimate", {
        city, district, area, beds, year_built: year, has_parking: true, has_elevator: true,
      }));
    } catch { setRes(null); } finally { setBusy(false); }
  };

  const field = "w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] px-4 py-3 text-sm outline-none focus:border-brand-500";

  return (
    <div className="surface grid gap-8 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-500">
          <Sparkles size={13} /> {t("estimate_title")}
        </span>
        <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">{t("cta_estimate")}</h3>
        <p className="mt-2 text-sm muted">{t("estimate_sub")}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-semibold muted">
            {t("city")}
            <select className={field} value={city} onChange={(e) => setCity(e.target.value)}>
              {meta?.cities.map((c) => (
                <option key={c.slug} value={c.slug}>{locale === "fa" ? c.name_fa : c.name_en}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold muted">
            {t("district")}
            <select className={field} value={district} onChange={(e) => setDistrict(e.target.value)}>
              {districts.map((d) => (
                <option key={d.en} value={d.en}>{locale === "fa" ? d.fa : d.en}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold muted">
            {t("area")} ({locale === "fa" ? "متر" : "m²"})
            <input type="number" min={20} max={2000} className={field} value={area} onChange={(e) => setArea(+e.target.value)} />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold muted">
            {t("beds")}
            <input type="number" min={0} max={9} className={field} value={beds} onChange={(e) => setBeds(+e.target.value)} />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold muted sm:col-span-2">
            {t("year_built")}
            <input type="range" min={1370} max={1404} value={year} onChange={(e) => setYear(+e.target.value)} className="accent-brand-600" />
            <span className="text-sm font-bold text-[color:var(--fg)]">{num(year, locale)}</span>
          </label>
        </div>

        <button onClick={run} disabled={busy} className="glow-btn mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold disabled:opacity-60">
          <Calculator size={16} /> {busy ? t("loading") : t("estimate_btn")}
        </button>
      </div>

      <div className="grid place-items-center rounded-[1.5rem] bg-gradient-to-br from-brand-600/12 via-[color:var(--color-violet-glow)]/10 to-[color:var(--color-aqua-glow)]/10 p-6 text-center">
        {res ? (
          <div className="w-full">
            <p className="text-xs muted">{t("estimate_value")}</p>
            <p className="mt-2 text-3xl font-black gradient-text sm:text-4xl">{price(res.value, locale)}</p>
            <p className="mt-3 text-xs muted">{t("estimate_range")}</p>
            <p className="text-sm font-bold">{price(res.range_low, locale)} — {price(res.range_high, locale)}</p>
            <div className="mx-auto mt-6 max-w-xs">
              <div className="flex justify-between text-[11px] muted">
                <span>{t("confidence")}</span>
                <span>{num(res.confidence * 100, locale)}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--line)]">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-400" style={{ width: `${res.confidence * 100}%` }} />
              </div>
            </div>
            <p className="mt-5 text-xs muted">
              {locale === "fa" ? res.district_fa : res.district_en} · {num(res.price_per_m, locale)} {locale === "fa" ? "میلیون در متر" : "M per m²"}
            </p>
          </div>
        ) : (
          <div className="muted">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[color:var(--glass)]">
              <Calculator size={30} />
            </div>
            <p className="mt-4 max-w-[16rem] text-sm">{t("estimate_sub")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
