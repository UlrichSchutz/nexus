"use client";

import type { MarketSnapshot } from "@/lib/exchange";

function ChangeBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-brand-muted">—</span>;
  const up = value >= 0;
  return (
    <span className={up ? "text-emerald-700" : "text-red-600"}>
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
      <div className="rounded-xl border border-brand-border bg-white/50 px-4 py-3 text-center text-sm text-brand-light">
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
    <div className="overflow-hidden rounded-xl border border-brand-border bg-white/80">
      <div className="flex items-center justify-between border-b border-brand-border/50 px-4 py-2">
        <span className="font-display text-xs uppercase tracking-widest text-brand-teal">
          {labels.liveMarkets}
        </span>
        <span className="text-[10px] text-brand-light">
          {labels.updated}: {new Date(markets.fetchedAt).toLocaleTimeString(locale)}
        </span>
      </div>
      <div className="ticker-scroll flex gap-8 whitespace-nowrap px-4 py-3">
        {[...items, ...items].map((item, i) => (
          <div key={`${item.key}-${i}`} className="inline-flex items-center gap-3 text-sm">
            <span className="font-display font-bold text-brand-ink">{item.label}</span>
            <span className="text-brand-muted">{item.price}</span>
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
          className="glass-panel rounded-xl p-5 transition hover:border-brand-teal/40"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-brand-ink">{c.symbol}</p>
              <p className="text-xs text-brand-light">{c.name}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                (c.change24h ?? 0) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {c.change24h != null ? `${c.change24h >= 0 ? "+" : ""}${c.change24h.toFixed(2)}%` : "—"}
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-brand-teal">
            {c.priceEur.toLocaleString(locale, { style: "currency", currency: "EUR" })}
          </p>
          {c.marketCapEur != null && (
            <p className="mt-2 text-xs text-brand-light">
              MCap: {(c.marketCapEur / 1e9).toFixed(1)}B €
            </p>
          )}
        </div>
      ))}
      {markets.forex.map((f) => (
        <div key={f.pair} className="glass-panel rounded-xl p-5">
          <p className="font-display text-lg font-bold text-brand-ink">{f.pair}</p>
          <p className="mt-2 font-display text-2xl text-brand-ink">{f.rate.toFixed(4)}</p>
          <p className="mt-1 text-xs text-brand-light">{labels.forex}</p>
        </div>
      ))}
    </div>
  );
}
