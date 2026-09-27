"use client";

import { useState } from "react";
import { ArrowRight, Smartphone } from "lucide-react";
import { useApp } from "@/components/providers";

export default function LoginPage() {
  const { t, locale } = useApp();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const field = "w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] px-4 py-3.5 text-sm outline-none focus:border-brand-500";

  return (
    <div className="mx-auto grid max-w-md px-4 py-20">
      <div className="surface rounded-[2rem] p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white"><Smartphone size={24} /></span>
        <h1 className="mt-5 text-2xl font-black">{step === "phone" ? t("login") : (locale === "fa" ? "کد تایید" : "Verification code")}</h1>
        <p className="mt-2 text-sm muted">
          {step === "phone"
            ? locale === "fa" ? "شماره تلفن همراه خود را بنویسید تا رمز یک‌بار مصرف برایتان پیامک شود." : "Enter your mobile number and we'll text you a one-time code."
            : locale === "fa" ? `کد پیامک‌شده به ${phone} را بنویسید.` : `Enter the code we sent to ${phone}.`}
        </p>

        {step === "phone" ? (
          <form className="mt-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); if (phone.length >= 8) setStep("otp"); }}>
            <input dir="ltr" inputMode="tel" required minLength={8} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxxx" className={field} />
            <button className="glow-btn flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold">
              {t("lead_send")} <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </form>
        ) : (
          <form className="mt-6 grid gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-center gap-2" dir="ltr">
              {Array.from({ length: 5 }).map((_, i) => (
                <input key={i} maxLength={1} inputMode="numeric" className="h-14 w-12 rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] text-center text-lg font-bold outline-none focus:border-brand-500" />
              ))}
            </div>
            <button className="glow-btn rounded-2xl py-3.5 text-sm font-bold">{t("login")}</button>
            <button type="button" onClick={() => setStep("phone")} className="text-xs font-bold muted">{t("back")}</button>
          </form>
        )}
        <p className="mt-6 text-center text-[11px] muted">{t("privacy")} · {t("terms")}</p>
      </div>
    </div>
  );
}
