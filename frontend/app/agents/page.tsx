"use client";

import { useEffect, useState } from "react";
import { getAgents, getMeta, type Agent, type Meta } from "@/lib/api";
import { useApp } from "@/components/providers";
import { AgentCard } from "@/components/agent-card";
import { Reveal, Skeleton } from "@/components/ui";

export default function AgentsPage() {
  const { t, locale } = useApp();
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [city, setCity] = useState("");

  useEffect(() => { getMeta().then(setMeta).catch(() => {}); }, []);
  useEffect(() => { setAgents(null); getAgents(city || undefined).then((r) => setAgents(r.items)).catch(() => setAgents([])); }, [city]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black">{t("agents_title")}</h1>
      <p className="mt-2 text-sm muted">{t("agents_sub")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setCity("")} data-active={city === ""} className="chip px-4 py-2 text-xs font-bold">{t("all_deals")}</button>
        {meta?.cities.map((c) => (
          <button key={c.slug} onClick={() => setCity(c.slug)} data-active={city === c.slug} className="chip px-4 py-2 text-xs font-bold">
            {locale === "fa" ? c.name_fa : c.name_en}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {agents
          ? agents.map((a, i) => <Reveal key={a.id} delay={i * 60}><AgentCard a={a} /></Reveal>)
          : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
      </div>
    </div>
  );
}
