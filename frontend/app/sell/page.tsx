"use client";

import { Camera, FileCheck2, HandCoins, Megaphone } from "lucide-react";
import { useApp } from "@/components/providers";
import { EstimateWidget } from "@/components/estimate";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/ui";

export default function SellPage() {
  const { t, locale } = useApp();
  const steps = [
    { icon: HandCoins, fa: "قیمت‌گذاری داده‌محور", en: "Data-driven pricing", dfa: "قیمت پیشنهادی بر پایه معامله‌های واقعی محله.", den: "A price backed by real deals in your neighborhood." },
    { icon: Camera, fa: "عکاسی و تور ۳۶۰", en: "Photos & 360° tour", dfa: "بسته تصویربرداری حرفه‌ای و تور مجازی رایگان.", den: "Professional photography and a free virtual tour." },
    { icon: FileCheck2, fa: "اعتبارسنجی سند", en: "Document check", dfa: "بررسی سند و مالکیت پیش از انتشار آگهی.", den: "Deed and ownership checks before going live." },
    { icon: Megaphone, fa: "بازاریابی هدفمند", en: "Targeted marketing", dfa: "نمایش آگهی به خریداران فعال همان محله.", den: "Your listing shown to active buyers nearby." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          {locale === "fa" ? "ملک‌تان را با " : "Sell your home with "}
          <span className="gradient-text">{locale === "fa" ? "کمیسیون شفاف" : "transparent fees"}</span>
          {locale === "fa" ? " بفروشید" : ""}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 muted">{t("footer_about")}</p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.en} delay={i * 70}>
            <div className="surface lift h-full rounded-3xl p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white"><s.icon size={22} /></span>
              <h3 className="mt-4 text-base font-bold">{locale === "fa" ? s.fa : s.en}</h3>
              <p className="mt-2 text-sm leading-7 muted">{locale === "fa" ? s.dfa : s.den}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12"><EstimateWidget /></div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="surface rounded-3xl p-8">
          <h2 className="text-2xl font-black">{t("book_tour")}</h2>
          <p className="mt-2 text-sm muted">{t("estimate_sub")}</p>
          <div className="mt-6"><LeadForm /></div>
        </div>
        <div className="overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70" alt="" className="h-full min-h-72 w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
