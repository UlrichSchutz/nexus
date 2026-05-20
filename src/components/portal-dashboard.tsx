"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/routing";
import type { MarketSnapshot } from "@/lib/exchange";
import { MarketGrid, MarketTicker } from "@/components/market-ticker";

type AccountData = {
  btcAmount: number;
  eurAmount: number;
  displayEur: number;
  eurSource: "admin" | "market";
  liveEurEstimate: number | null;
  btcPriceEur: number | null;
  btcChange24h: number | null;
  systemNotice: string | null;
  updatedAt: string | null;
  rates: { btcEur: number | null; liveEurEstimate: number | null; fetchedAt: string };
};

type BankAccount = { recipientName: string; iban: string; bic: string };
type Withdrawal = { id: string; btcAmount: string; status: string; createdAt: string; clientNote: string | null };
type Labels = Record<string, string>;

function safeNum(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatEur(value: unknown, locale: string, maxFrac = 2): string {
  return safeNum(value).toLocaleString(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: maxFrac,
    maximumFractionDigits: maxFrac,
  });
}

const SUPPORT = {
  email: "info@nexus-tech.info",
  phone: "+44 7451 250055",
  web: "nexus-tech.info",
};

export function PortalDashboard({
  userName,
  locale,
  labels,
}: {
  userName: string;
  locale: string;
  labels: Labels;
}) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [markets, setMarkets] = useState<MarketSnapshot | null>(null);
  const [bank, setBank] = useState<BankAccount | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankForm, setBankForm] = useState({ recipientName: "", iban: "", bic: "" });
  const [withdrawBtc, setWithdrawBtc] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const [accRes, bankRes, wRes, mRes] = await Promise.all([
      fetch("/api/portal/account"),
      fetch("/api/portal/bank"),
      fetch("/api/portal/withdrawal"),
      fetch("/api/markets"),
    ]);

    if (accRes.ok) {
      const raw = await accRes.json();
      setAccount({
        ...raw,
        btcAmount: safeNum(raw.btcAmount),
        eurAmount: safeNum(raw.eurAmount),
        displayEur: safeNum(raw.displayEur),
        eurSource: raw.eurSource === "admin" ? "admin" : "market",
        liveEurEstimate: raw.liveEurEstimate != null ? safeNum(raw.liveEurEstimate) : null,
        btcPriceEur: raw.btcPriceEur != null ? safeNum(raw.btcPriceEur) : null,
        btcChange24h: raw.btcChange24h ?? null,
        rates: {
          btcEur: raw.rates?.btcEur ?? null,
          liveEurEstimate: raw.rates?.liveEurEstimate != null ? safeNum(raw.rates.liveEurEstimate) : null,
          fetchedAt: raw.rates?.fetchedAt ?? "",
        },
      });
    }
    if (mRes.ok) setMarkets(await mRes.json());
    if (bankRes.ok) {
      const data = await bankRes.json();
      if (data.bank) {
        setBank(data.bank);
        setBankForm({
          recipientName: data.bank.recipientName,
          iban: data.bank.iban,
          bic: data.bank.bic,
        });
      }
    }
    if (wRes.ok) {
      const data = await wRes.json();
      setWithdrawals(data.requests ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  }, [load]);

  async function saveBank(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/portal/bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankForm),
    });
    if (res.ok) {
      setMsg(labels.bankSaved);
      load();
    } else setErr(labels.bankError);
  }

  async function submitWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const amount = parseFloat(withdrawBtc);
    if (!amount || amount <= 0) {
      setErr(labels.withdrawError);
      return;
    }
    const res = await fetch("/api/portal/withdrawal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ btcAmount: amount, clientNote: withdrawNote || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg(labels.withdrawSent);
      setWithdrawBtc("");
      setWithdrawNote("");
      load();
    } else {
      setErr(
        data.error === "Bank account required"
          ? labels.bankRequired
          : data.error === "Insufficient balance"
            ? labels.insufficientBalance
            : data.error === "Pending request exists"
              ? labels.pendingExists
              : labels.withdrawError
      );
    }
  }

  const statusLabel = (s: string) =>
    ({ PENDING: labels.statusPending, APPROVED: labels.statusApproved, REJECTED: labels.statusRejected, COMPLETED: labels.statusCompleted })[s] ?? s;

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING").length;
  const displayEur = account?.displayEur ?? 0;
  const btc = account?.btcAmount ?? 0;

  return (
    <section className="px-4 py-10 md:py-14">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-brand-teal">{labels.secureArea}</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-brand-ink md:text-4xl">{labels.title}</h1>
            <p className="mt-2 text-brand-muted">
              {labels.welcome}, <span className="text-brand-ink">{userName}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded border border-brand-border px-4 py-2 text-sm text-brand-muted hover:text-brand-teal">
              {labels.backHome}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="rounded border border-brand-border px-4 py-2 text-sm text-brand-muted hover:text-brand-teal"
            >
              {labels.logout}
            </button>
          </div>
        </div>

        {msg && (
          <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-50 p-4 text-sm text-emerald-700">{msg}</p>
        )}
        {err && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{err}</p>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="font-display text-brand-teal animate-pulse">{labels.loading}</p>
          </div>
        ) : (
          <div className="space-y-10">
            <MarketTicker markets={markets} labels={labels} locale={locale} />

            {account?.systemNotice && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8">
                <p className="mb-2 font-display text-xs uppercase tracking-widest text-amber-800">{labels.systemNotice}</p>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-amber-900">{account.systemNotice}</p>
              </div>
            )}

            {/* Portfolio hero */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="glass-panel relative overflow-hidden rounded-2xl border border-brand-teal/40 p-8 md:p-10 lg:col-span-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-teal/10 blur-3xl" />
                <p className="mb-2 font-display text-xs uppercase tracking-widest text-brand-teal">{labels.eurBalance}</p>
                <p className="font-display text-5xl font-bold text-brand-tealDark md:text-6xl lg:text-7xl">
                  {formatEur(displayEur, locale, 2)}
                </p>
                {account?.eurSource === "market" && (
                  <p className="mt-3 text-sm text-brand-teal/80">{labels.eurFromMarket}</p>
                )}
                {account?.eurSource === "admin" && account.eurAmount > 0 && (
                  <p className="mt-3 text-sm text-brand-light">{labels.eurFromAdmin}</p>
                )}
                {account?.updatedAt && (
                  <p className="mt-4 text-xs text-brand-light">
                    {labels.lastUpdated}: {new Date(account.updatedAt).toLocaleString(locale)}
                  </p>
                )}
                {btc > 0 && account?.btcPriceEur && (
                  <p className="mt-4 rounded-lg border border-brand-border/50 bg-brand-canvas/40 px-4 py-3 text-sm text-brand-muted">
                    {labels.valuationBreakdown}: {btc.toFixed(8)} BTC × {formatEur(account.btcPriceEur, locale)} ={" "}
                    <span className="text-brand-ink">{formatEur(account.liveEurEstimate, locale)}</span>
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                <div className="glass-panel rounded-2xl p-6">
                  <p className="font-display text-xs uppercase text-brand-light">{labels.btcBalance}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-brand-ink">
                    {btc.toFixed(8)} <span className="text-lg text-brand-teal">BTC</span>
                  </p>
                  {account?.btcChange24h != null && (
                    <p className={`mt-2 text-sm ${account.btcChange24h >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      24h: {account.btcChange24h >= 0 ? "+" : ""}
                      {account.btcChange24h.toFixed(2)}%
                    </p>
                  )}
                </div>
                <div className="glass-panel rounded-2xl p-6">
                  <p className="font-display text-xs uppercase text-brand-light">{labels.quickStats}</p>
                  <ul className="mt-3 space-y-2 text-sm text-brand-muted">
                    <li className="flex justify-between">
                      <span>{labels.openRequests}</span>
                      <span className="text-brand-ink">{pendingWithdrawals}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{labels.bankLinked}</span>
                      <span className={bank ? "text-emerald-700" : "text-amber-700"}>{bank ? "✓" : "—"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>BTC/EUR</span>
                      <span className="text-brand-ink">{account?.btcPriceEur ? formatEur(account.btcPriceEur, locale, 0) : "—"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Live markets */}
            <div>
              <h2 className="mb-6 font-display text-2xl font-bold text-brand-ink">{labels.marketOverview}</h2>
              <MarketGrid markets={markets} labels={labels} locale={locale} />
            </div>

            <div className="grid gap-8 xl:grid-cols-3">
              {/* Bank + withdrawal */}
              <div className="space-y-8 xl:col-span-2">
                <div className="glass-panel rounded-2xl p-6 md:p-8">
                  <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">{labels.bankTitle}</h2>
                  <p className="mb-6 text-sm text-brand-light">{labels.bankDesc}</p>
                  <form onSubmit={saveBank} className="grid gap-4 md:grid-cols-2">
                    <input className="tech-input md:col-span-2" placeholder={labels.recipientName} required value={bankForm.recipientName} onChange={(e) => setBankForm({ ...bankForm, recipientName: e.target.value })} />
                    <input className="tech-input" placeholder={labels.iban} required value={bankForm.iban} onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })} />
                    <input className="tech-input" placeholder={labels.bic} required value={bankForm.bic} onChange={(e) => setBankForm({ ...bankForm, bic: e.target.value })} />
                    <button type="submit" className="btn-cyber md:col-span-2">{bank ? labels.bankUpdate : labels.bankSave}</button>
                  </form>
                </div>

                <div className="glass-panel rounded-2xl p-6 md:p-8">
                  <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">{labels.withdrawTitle}</h2>
                  <p className="mb-6 text-sm text-brand-light">{labels.withdrawDesc}</p>
                  <form onSubmit={submitWithdrawal} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input className="tech-input" type="number" step="0.00000001" min="0" max={btc} placeholder={labels.withdrawAmount} required value={withdrawBtc} onChange={(e) => setWithdrawBtc(e.target.value)} />
                      <p className="flex items-center text-xs text-brand-light md:justify-end">
                        {labels.maxWithdraw}: {btc.toFixed(8)} BTC
                      </p>
                    </div>
                    <textarea className="tech-input resize-y" rows={3} placeholder={labels.withdrawNote} value={withdrawNote} onChange={(e) => setWithdrawNote(e.target.value)} />
                    <button type="submit" className="btn-cyber" disabled={!bank}>{labels.withdrawSubmit}</button>
                    {!bank && <p className="text-xs text-amber-700">{labels.bankRequired}</p>}
                  </form>
                </div>

                {withdrawals.length > 0 && (
                  <div className="glass-panel overflow-hidden rounded-2xl">
                    <h2 className="border-b border-brand-border p-5 font-display text-lg font-bold text-brand-ink">{labels.withdrawHistory}</h2>
                    <ul className="divide-y divide-brand-border/50">
                      {withdrawals.map((w) => (
                        <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                          <div>
                            <p className="font-display text-brand-ink">{Number(w.btcAmount).toFixed(8)} BTC</p>
                            <p className="text-xs text-brand-light">{new Date(w.createdAt).toLocaleString(locale)}</p>
                          </div>
                          <span className={`rounded px-3 py-1 text-xs font-medium uppercase ${w.status === "PENDING" ? "bg-amber-100 text-amber-800" : w.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                            {statusLabel(w.status)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Support sidebar */}
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl border border-brand-teal/20 p-6 md:p-8">
                  <h2 className="mb-4 font-display text-xl font-bold text-brand-ink">{labels.supportTitle}</h2>
                  <p className="mb-6 text-sm leading-relaxed text-brand-muted">{labels.supportDesc}</p>
                  <div className="space-y-4 text-sm">
                    <a href={`mailto:${SUPPORT.email}`} className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-canvas/50 p-4 transition hover:border-brand-teal/50">
                      <span className="text-xl">✉</span>
                      <div>
                        <p className="text-xs text-brand-light">E-Mail</p>
                        <p className="text-brand-teal">{SUPPORT.email}</p>
                      </div>
                    </a>
                    <a href={`tel:${SUPPORT.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-canvas/50 p-4 transition hover:border-brand-teal/50">
                      <span className="text-xl">📞</span>
                      <div>
                        <p className="text-xs text-brand-light">{labels.phone}</p>
                        <p className="text-brand-ink">{SUPPORT.phone}</p>
                      </div>
                    </a>
                    <div className="rounded-lg border border-brand-border bg-brand-canvas/50 p-4">
                      <p className="text-xs text-brand-light">{labels.hours}</p>
                      <p className="mt-1 text-brand-muted">{labels.supportHours}</p>
                    </div>
                  </div>
                  <Link href="/contact" className="btn-cyber mt-6 block w-full text-center">
                    {labels.contactForm}
                  </Link>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="mb-3 font-display text-sm font-bold uppercase text-brand-muted">{labels.securityTips}</h3>
                  <ul className="space-y-2 text-xs leading-relaxed text-brand-light">
                    <li>• {labels.tip1}</li>
                    <li>• {labels.tip2}</li>
                    <li>• {labels.tip3}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
