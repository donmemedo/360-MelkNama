"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Home, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useApp } from "./providers";

const links = [
  { href: "/search?deal=sale", key: "nav_buy" },
  { href: "/search?deal=rent", key: "nav_rent" },
  { href: "/sell", key: "nav_sell" },
  { href: "/agents", key: "nav_agents" },
] as const;

export function Header() {
  const { t, locale, setLocale, theme, toggleTheme, favorites } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "surface shadow-lg" : "border-b border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-[color:var(--color-violet-glow)] text-white shadow-lg transition-transform group-hover:rotate-6">
            <Home size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="gradient-text">{t("brand")}</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium muted transition hover:bg-[color:var(--glass)] hover:text-[color:var(--fg)]"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Link
            href="/favorites"
            aria-label={t("favorites")}
            className="relative hidden h-10 w-10 place-items-center rounded-full surface sm:grid"
          >
            <Heart size={17} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -end-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
            className="flex h-10 items-center gap-1.5 rounded-full surface px-3 text-xs font-semibold"
            aria-label="Change language"
          >
            <Languages size={15} />
            {t("lang")}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("theme_light") : t("theme_dark")}
            className="grid h-10 w-10 place-items-center rounded-full surface"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-full glow-btn px-5 text-sm font-bold sm:flex"
          >
            {t("login")}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full surface md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="surface md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-4 pb-4">
            {links.map((l) => (
              <Link key={l.key} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium">
                {t(l.key)}
              </Link>
            ))}
            <Link href="/favorites" className="rounded-xl px-4 py-3 text-sm font-medium">
              {t("favorites")}
            </Link>
            <Link href="/login" className="mt-1 rounded-xl glow-btn px-4 py-3 text-center text-sm font-bold">
              {t("login")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
