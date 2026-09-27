"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { post } from "@/lib/api";
import { useApp } from "./providers";

export function LeadForm({ listingId }: { listingId?: string }) {
  const { t, locale } = useApp();
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [busy, setBusy] = useState(false);
  const field = "w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] px-4 py-3 text-sm outline-none focus:border-brand-500";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await post("/api/leads", {
        listing_id: listingId ?? null,
        name: String(f.get("name")),
        phone: String(f.get("phone")),
        message: String(f.get("message") ?? ""),
        kind: "tour",
        locale,
      });
      setState("sent");
      e.currentTarget.reset();
    } catch { setState("error"); } finally { setBusy(false); }
  };

  if (state === "sent")
    return (
      <div className="grid place-items-center gap-3 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white"><Check size={22} /></span>
        <p className="text-sm font-semibold">{t("lead_ok")}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input name="name" required minLength={2} placeholder={t("lead_name")} className={field} />
      <input name="phone" required minLength={8} inputMode="tel" dir="ltr" placeholder={t("lead_phone")} className={field} />
      <textarea name="message" rows={3} placeholder={t("lead_msg")} className={field} />
      <button disabled={busy} className="glow-btn flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold disabled:opacity-60">
        <Send size={15} /> {busy ? t("loading") : t("lead_send")}
      </button>
      {state === "error" && <p className="text-xs font-semibold text-brand-500">{t("lead_err")}</p>}
    </form>
  );
}
