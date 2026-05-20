"use client";

import type { MarketSnapshot } from "@/lib/exchange";

function ChangeBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-gray-600">—</span>;
  const up = value >= 0;
  return (
    <span className={up ? "text-emerald-400" : "text-red-400"}>
      {up ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export function MarketTicker({
  markets,
  labels,
  locale,
}: {
  markets: MarketSnapshot | null;
  labels: Record<string, string>;
  locale: string;
}) {
  if (!markets?.crypto.length) {
    return (
      <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 px-4 py-3 text-center text-sm text-gray-500">
        {labels.marketsLoading}
      </div>
    );
  }

  const items = [
    ...markets.crypto.map((c) => ({
      key: c.id,
      label: c.symbol,
      price: c.priceEur.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
      change: c.change24h,
    })),
    ...markets.forex.map((f) => ({
      key: f.pair,
      label: f.pair,
      price: f.rate.toFixed(4),
      change: null as number | null,
    })),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-panel/80">
      <div className="flex items-center justify-between border-b border-cyber-border/50 px-4 py-2">
        <span className="font-tech text-xs uppercase tracking-widest text-cyber-cyan">
          {labels.liveMarkets}
        </span>
        <span className="text-[10px] text-gray-600">
          {labels.updated}: {new Date(markets.fetchedAt).toLocaleTimeString(locale)}
        </span>
      </div>
      <div className="ticker-scroll flex gap-8 whitespace-nowrap px-4 py-3">
        {[...items, ...items].map((item, i) => (
          <div key={`${item.key}-${i}`} className="inline-flex items-center gap-3 text-sm">
            <span className="font-tech font-bold text-white">{item.label}</span>
            <span className="text-gray-300">{item.price}</span>
            <ChangeBadge value={item.change} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketGrid({
  markets,
  labels,
  locale,
}: {
  markets: MarketSnapshot | null;
  labels: Record<string, string>;
  locale: string;
}) {
  if (!markets) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.crypto.map((c) => (
        <div
          key={c.id}
          className="glass-panel neon-border rounded-xl p-5 transition hover:border-cyber-cyan/40"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-tech text-lg font-bold text-white">{c.symbol}</p>
              <p className="text-xs text-gray-500">{c.name}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                (c.change24h ?? 0) >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
              }`}
            >
              {c.change24h != null ? `${c.change24h >= 0 ? "+" : ""}${c.change24h.toFixed(2)}%` : "—"}
            </span>
          </div>
          <p className="font-tech text-2xl font-bold text-cyber-cyan">
            {c.priceEur.toLocaleString(locale, { style: "currency", currency: "EUR" })}
          </p>
          {c.marketCapEur != null && (
            <p className="mt-2 text-xs text-gray-600">
              MCap: {(c.marketCapEur / 1e9).toFixed(1)}B €
            </p>
          )}
        </div>
      ))}
      {markets.forex.map((f) => (
        <div key={f.pair} className="glass-panel rounded-xl p-5">
          <p className="font-tech text-lg font-bold text-white">{f.pair}</p>
          <p className="mt-2 font-tech text-2xl text-white">{f.rate.toFixed(4)}</p>
          <p className="mt-1 text-xs text-gray-500">{labels.forex}</p>
        </div>
      ))}
    </div>
  );
}
