"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/routing";

type Client = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  balance: {
    btcAmount: string;
    eurAmount: string;
    systemNotice: string | null;
    note: string | null;
  } | null;
};

type Withdrawal = {
  id: string;
  btcAmount: string;
  status: string;
  clientNote: string | null;
  adminNote: string | null;
  createdAt: string;
  user: { email: string; firstName: string | null; lastName: string | null };
  bankAccount: { recipientName: string; iban: string; bic: string };
};

type ClientEdit = { btc: string; eur: string; systemNotice: string; note: string };

type Labels = Record<string, string>;

export function AdminBackoffice({ labels, locale }: { labels: Labels; locale: string }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"clients" | "withdrawals">("clients");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    btcAmount: "0",
    eurAmount: "0",
    systemNotice: "",
    note: "",
  });
  const [edits, setEdits] = useState<Record<string, ClientEdit>>({});

  const load = useCallback(async () => {
    const [cRes, wRes] = await Promise.all([
      fetch("/api/admin/clients"),
      fetch("/api/admin/withdrawals"),
    ]);
    if (cRes.ok) {
      const data = await cRes.json();
      setClients(data.clients);
      const map: Record<string, ClientEdit> = {};
      for (const c of data.clients as Client[]) {
        map[c.id] = {
          btc: c.balance ? String(c.balance.btcAmount) : "0",
          eur: c.balance ? String(c.balance.eurAmount) : "0",
          systemNotice: c.balance?.systemNotice ?? "",
          note: c.balance?.note ?? "",
        };
      }
      setEdits(map);
    }
    if (wRes.ok) {
      const data = await wRes.json();
      setWithdrawals(data.requests);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        btcAmount: parseFloat(form.btcAmount) || 0,
        eurAmount: parseFloat(form.eurAmount) || 0,
        systemNotice: form.systemNotice || undefined,
      }),
    });
    if (res.ok) {
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        btcAmount: "0",
        eurAmount: "0",
        systemNotice: "",
        note: "",
      });
      load();
    }
  }

  async function saveBalance(userId: string) {
    const edit = edits[userId];
    if (!edit) return;
    await fetch("/api/admin/balance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        btcAmount: parseFloat(edit.btc) || 0,
        eurAmount: parseFloat(edit.eur) || 0,
        systemNotice: edit.systemNotice || null,
        note: edit.note || undefined,
      }),
    });
    load();
  }

  async function updateWithdrawal(id: string, status: string, adminNote?: string) {
    await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminNote }),
    });
    load();
  }

  const pendingCount = withdrawals.filter((w) => w.status === "PENDING").length;

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-brand-ink">{labels.title}</h1>
          <div className="flex gap-3">
            <Link href="/portal" className="text-sm text-brand-teal hover:underline">
              {labels.clientPortal}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="text-sm text-brand-light hover:text-brand-teal"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("clients")}
            className={`rounded-lg px-5 py-2 font-display text-sm uppercase ${
              tab === "clients" ? "bg-brand-teal text-white" : "border border-brand-border text-brand-muted"
            }`}
          >
            {labels.clients}
          </button>
          <button
            type="button"
            onClick={() => setTab("withdrawals")}
            className={`rounded-lg px-5 py-2 font-display text-sm uppercase ${
              tab === "withdrawals" ? "bg-brand-teal text-white" : "border border-brand-border text-brand-muted"
            }`}
          >
            {labels.withdrawals}
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-black">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {tab === "clients" && (
          <>
            <div className="glass-panel mb-12 rounded-2xl p-6 md:p-8">
              <h2 className="mb-6 font-display text-xl font-bold text-brand-teal">
                + {labels.createClient}
              </h2>
              <form onSubmit={createClient} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <input className="tech-input" placeholder={labels.email} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="tech-input" placeholder={labels.password} type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <input className="tech-input" placeholder={labels.firstName} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input className="tech-input" placeholder={labels.lastName} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input className="tech-input" placeholder={labels.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="tech-input" placeholder={labels.btcBalance} type="number" step="0.00000001" min="0" value={form.btcAmount} onChange={(e) => setForm({ ...form, btcAmount: e.target.value })} />
                <input className="tech-input" placeholder={`${labels.eurBalance} (0 = Marktkurs)`} type="number" step="0.01" min="0" value={form.eurAmount} onChange={(e) => setForm({ ...form, eurAmount: e.target.value })} />
                <input className="tech-input lg:col-span-2" placeholder={labels.systemNotice} value={form.systemNotice} onChange={(e) => setForm({ ...form, systemNotice: e.target.value })} />
                <input className="tech-input lg:col-span-2" placeholder={labels.note} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                <button type="submit" className="btn-cyber">{labels.createClient}</button>
              </form>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl">
              <h2 className="border-b border-brand-border p-6 font-display text-xl font-bold text-brand-ink">
                {labels.clients} ({clients.length})
              </h2>
              {loading ? (
                <p className="p-8 text-center text-brand-light">...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">
                    <thead className="border-b border-brand-border bg-brand-canvas/50 font-display text-xs uppercase text-brand-light">
                      <tr>
                        <th className="p-3">{labels.email}</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">{labels.btcBalance}</th>
                        <th className="p-3">{labels.eurBalance}</th>
                        <th className="p-3">{labels.systemNotice}</th>
                        <th className="p-3">{labels.note}</th>
                        <th className="p-3">{labels.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c) => (
                        <tr key={c.id} className="border-b border-brand-border/50 align-top hover:bg-brand-canvas">
                          <td className="p-3 text-brand-muted">{c.email}</td>
                          <td className="p-3 text-brand-muted">{c.firstName} {c.lastName}</td>
                          <td className="p-3">
                            <input type="number" step="0.00000001" min="0" className="tech-input w-28" value={edits[c.id]?.btc ?? "0"} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], btc: e.target.value, eur: p[c.id]?.eur ?? "0", systemNotice: p[c.id]?.systemNotice ?? "", note: p[c.id]?.note ?? "" } }))} />
                          </td>
                          <td className="p-3">
                            <input type="number" step="0.01" min="0" className="tech-input w-28" value={edits[c.id]?.eur ?? "0"} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], eur: e.target.value, btc: p[c.id]?.btc ?? "0", systemNotice: p[c.id]?.systemNotice ?? "", note: p[c.id]?.note ?? "" } }))} />
                          </td>
                          <td className="p-3">
                            <textarea className="tech-input min-h-[60px] min-w-[180px] resize-y text-xs" value={edits[c.id]?.systemNotice ?? ""} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], systemNotice: e.target.value, btc: p[c.id]?.btc ?? "0", eur: p[c.id]?.eur ?? "0", note: p[c.id]?.note ?? "" } }))} />
                          </td>
                          <td className="p-3">
                            <input className="tech-input min-w-[120px] text-xs" value={edits[c.id]?.note ?? ""} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], note: e.target.value, btc: p[c.id]?.btc ?? "0", eur: p[c.id]?.eur ?? "0", systemNotice: p[c.id]?.systemNotice ?? "" } }))} />
                          </td>
                          <td className="p-3">
                            <button type="button" onClick={() => saveBalance(c.id)} className="rounded border border-brand-teal px-3 py-2 text-xs font-display uppercase text-brand-teal hover:bg-brand-teal/10">
                              {labels.save}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "withdrawals" && (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <h2 className="border-b border-brand-border p-6 font-display text-xl font-bold text-brand-ink">
              {labels.withdrawals}
            </h2>
            {loading ? (
              <p className="p-8 text-center text-brand-light">...</p>
            ) : withdrawals.length === 0 ? (
              <p className="p-8 text-center text-brand-light">{labels.noWithdrawals}</p>
            ) : (
              <div className="divide-y divide-brand-border/50">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-lg text-brand-ink">
                          {Number(w.btcAmount).toFixed(8)} BTC
                          <span className={`ml-3 rounded px-2 py-0.5 text-xs ${w.status === "PENDING" ? "bg-amber-100 text-amber-800" : w.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                            {w.status}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-brand-muted">
                          {w.user.firstName} {w.user.lastName} · {w.user.email}
                        </p>
                        <p className="mt-1 text-xs text-brand-light">
                          {new Date(w.createdAt).toLocaleString(locale)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w.status === "PENDING" && (
                          <>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "APPROVED")} className="rounded border border-emerald-500/50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50">
                              {labels.approve}
                            </button>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "REJECTED")} className="rounded border border-red-500/50 px-3 py-1 text-xs text-red-600 hover:bg-red-500/10">
                              {labels.reject}
                            </button>
                          </>
                        )}
                        {w.status === "APPROVED" && (
                          <button type="button" onClick={() => updateWithdrawal(w.id, "COMPLETED")} className="rounded border border-brand-teal/50 px-3 py-1 text-xs text-brand-teal">
                            {labels.complete}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-brand-border bg-brand-canvas/50 p-4 text-sm">
                      <p className="text-brand-light">{labels.recipientName}: <span className="text-brand-ink">{w.bankAccount.recipientName}</span></p>
                      <p className="text-brand-light">IBAN: <span className="font-mono text-brand-ink">{w.bankAccount.iban}</span></p>
                      <p className="text-brand-light">BIC: <span className="font-mono text-brand-ink">{w.bankAccount.bic}</span></p>
                      {w.clientNote && <p className="mt-2 text-brand-muted">{labels.clientNote}: {w.clientNote}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
