"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Locale, type TKey } from "@/lib/i18n";

type Theme = "light" | "dark";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (k: TKey) => string;
  dir: "rtl" | "ltr";
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [theme, setTheme] = useState<Theme>("dark");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const l = localStorage.getItem("mn-locale") as Locale | null;
      const th = localStorage.getItem("mn-theme") as Theme | null;
      const f = localStorage.getItem("mn-favs");
      if (l) setLocaleState(l);
      if (th) setTheme(th);
      else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
      if (f) setFavorites(JSON.parse(f));
      // deep-link overrides: ?lang=en&theme=light
      const url = new URLSearchParams(window.location.search);
      const ql = url.get("lang");
      const qt = url.get("theme");
      if (ql === "fa" || ql === "en") setLocaleState(ql);
      if (qt === "light" || qt === "dark") setTheme(qt);
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = locale === "fa" ? "rtl" : "ltr";
    el.dataset.theme = theme;
    try {
      localStorage.setItem("mn-locale", locale);
      localStorage.setItem("mn-theme", theme);
    } catch {}
  }, [locale, theme]);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale: setLocaleState,
      theme,
      toggleTheme: () => setTheme((v) => (v === "dark" ? "light" : "dark")),
      t: (k) => dict[locale][k],
      dir: locale === "fa" ? "rtl" : "ltr",
      favorites,
      toggleFavorite: (id) =>
        setFavorites((prev) => {
          const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
          try { localStorage.setItem("mn-favs", JSON.stringify(next)); } catch {}
          return next;
        }),
    }),
    [locale, theme, favorites],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
