import type { Locale } from "./i18n";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const toFa = (s: string | number) =>
  String(s).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const num = (v: number, locale: Locale) => {
  const s = new Intl.NumberFormat("en-US").format(Math.round(v));
  return locale === "fa" ? toFa(s) : s;
};

/** Prices are stored in million Toman. */
export const price = (v: number, locale: Locale) => {
  const t = locale === "fa" ? { b: "میلیارد تومان", m: "میلیون تومان" } : { b: "B Toman", m: "M Toman" };
  if (v >= 1000) {
    const b = v / 1000;
    const s = b >= 100 ? b.toFixed(0) : b.toFixed(1).replace(/\.0$/, "");
    return `${locale === "fa" ? toFa(s) : s} ${t.b}`;
  }
  return `${num(v, locale)} ${t.m}`;
};

export const ppm = (v: number, locale: Locale) =>
  locale === "fa" ? `${num(v, locale)} میلیون / متر` : `${num(v, locale)} M / m²`;

export const dateStr = (iso: string, locale: Locale) => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};
