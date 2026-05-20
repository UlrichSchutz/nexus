export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  priceEur: number;
  change24h: number | null;
  marketCapEur: number | null;
};

export type MarketSnapshot = {
  fetchedAt: string;
  crypto: MarketAsset[];
  forex: { pair: string; rate: number }[];
  btcEur: number | null;
};

const CRYPTO_IDS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
];

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  const fetchedAt = new Date().toISOString();
  const empty: MarketSnapshot = { fetchedAt, crypto: [], forex: [], btcEur: null };

  try {
    const ids = CRYPTO_IDS.map((c) => c.id).join(",");
    const [cgRes, fxRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) }
      ),
      fetch("https://api.frankfurter.app/latest?from=EUR&to=CHF,USD,GBP", {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    let crypto: MarketAsset[] = [];
    let btcEur: number | null = null;

    if (cgRes.ok) {
      const rows = await cgRes.json();
      if (Array.isArray(rows)) {
        crypto = rows.map((r: { id: string; symbol: string; name: string; current_price: number; price_change_percentage_24h: number; market_cap: number }) => ({
          id: r.id,
          symbol: r.symbol?.toUpperCase() ?? "",
          name: r.name ?? "",
          priceEur: r.current_price ?? 0,
          change24h: r.price_change_percentage_24h ?? null,
          marketCapEur: r.market_cap ?? null,
        }));
        btcEur = crypto.find((c) => c.id === "bitcoin")?.priceEur ?? null;
      }
    }

    let forex: { pair: string; rate: number }[] = [];
    if (fxRes.ok) {
      const fx = await fxRes.json();
      const rates = fx?.rates ?? {};
      forex = [
        { pair: "EUR/CHF", rate: rates.CHF ?? 0 },
        { pair: "EUR/USD", rate: rates.USD ?? 0 },
        { pair: "EUR/GBP", rate: rates.GBP ?? 0 },
      ].filter((f) => f.rate > 0);
    }

    return { fetchedAt, crypto, forex, btcEur };
  } catch {
    return empty;
  }
}

export function btcToEurLive(btc: number, rate: number | null): number | null {
  if (rate == null || btc <= 0) return null;
  const v = btc * rate;
  return Number.isFinite(v) ? v : null;
}

export function resolveDisplayEur(adminEur: number, btc: number, btcEurRate: number | null) {
  const live = btcToEurLive(btc, btcEurRate);
  const admin = Number.isFinite(adminEur) ? adminEur : 0;
  if (admin > 0) {
    return { displayEur: admin, eurSource: "admin" as const, adminEur: admin, liveEur: live };
  }
  return {
    displayEur: live ?? 0,
    eurSource: "market" as const,
    adminEur: 0,
    liveEur: live,
  };
}
