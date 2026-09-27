"use client";

import Link from "next/link";
import { Home, Instagram, Send, Twitter } from "lucide-react";
import { useApp } from "./providers";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="relative z-10 mt-24 border-t border-[color:var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white">
              <Home size={20} />
            </span>
            <span className="text-lg font-extrabold gradient-text">{t("brand")}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 muted">{t("footer_about")}</p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Send, Twitter].map((Icon, i) => (
              <span key={i} className="grid h-10 w-10 place-items-center rounded-full surface transition hover:text-brand-500">
                <Icon size={16} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold">{t("quick_links")}</h4>
          <ul className="space-y-3 text-sm muted">
            <li><Link href="/search?deal=sale">{t("nav_buy")}</Link></li>
            <li><Link href="/search?deal=rent">{t("nav_rent")}</Link></li>
            <li><Link href="/agents">{t("nav_agents")}</Link></li>
            <li><Link href="/sell">{t("nav_sell")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold">{t("support")}</h4>
          <ul className="space-y-3 text-sm muted">
            <li><Link href="/privacy">{t("privacy")}</Link></li>
            <li><Link href="/terms">{t("terms")}</Link></li>
            <li dir="ltr">+98 21 9100 3600</li>
            <li dir="ltr">hello@melknama360.ir</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--line)] py-6 text-center text-xs muted">
        © {new Date().getFullYear()} {t("brand")} — {t("footer_rights")}
      </div>
    </footer>
  );
}
