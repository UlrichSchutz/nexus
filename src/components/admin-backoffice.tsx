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
          <h1 className="font-tech text-3xl font-bold text-white">{labels.title}</h1>
          <div className="flex gap-3">
            <Link href="/portal" className="text-sm text-cyber-cyan hover:underline">
              {labels.clientPortal}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="text-sm text-gray-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("clients")}
            className={`rounded-lg px-5 py-2 font-tech text-sm uppercase ${
              tab === "clients" ? "bg-cyber-cyan text-cyber-dark" : "border border-gray-600 text-gray-400"
            }`}
          >
            {labels.clients}
          </button>
          <button
            type="button"
            onClick={() => setTab("withdrawals")}
            className={`rounded-lg px-5 py-2 font-tech text-sm uppercase ${
              tab === "withdrawals" ? "bg-cyber-cyan text-cyber-dark" : "border border-gray-600 text-gray-400"
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
              <h2 className="mb-6 font-tech text-xl font-bold text-cyber-cyan">
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
              <h2 className="border-b border-cyber-border p-6 font-tech text-xl font-bold text-white">
                {labels.clients} ({clients.length})
              </h2>
              {loading ? (
                <p className="p-8 text-center text-gray-500">...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">
                    <thead className="border-b border-cyber-border bg-cyber-dark/50 font-tech text-xs uppercase text-gray-500">
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
                        <tr key={c.id} className="border-b border-cyber-border/50 align-top hover:bg-white/5">
                          <td className="p-3 text-gray-300">{c.email}</td>
                          <td className="p-3 text-gray-300">{c.firstName} {c.lastName}</td>
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
                            <button type="button" onClick={() => saveBalance(c.id)} className="rounded border border-cyber-cyan px-3 py-2 text-xs font-tech uppercase text-cyber-cyan hover:bg-cyber-cyan/10">
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
            <h2 className="border-b border-cyber-border p-6 font-tech text-xl font-bold text-white">
              {labels.withdrawals}
            </h2>
            {loading ? (
              <p className="p-8 text-center text-gray-500">...</p>
            ) : withdrawals.length === 0 ? (
              <p className="p-8 text-center text-gray-500">{labels.noWithdrawals}</p>
            ) : (
              <div className="divide-y divide-cyber-border/50">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-tech text-lg text-white">
                          {Number(w.btcAmount).toFixed(8)} BTC
                          <span className={`ml-3 rounded px-2 py-0.5 text-xs ${w.status === "PENDING" ? "bg-amber-500/20 text-amber-400" : "bg-gray-700 text-gray-300"}`}>
                            {w.status}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {w.user.firstName} {w.user.lastName} · {w.user.email}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(w.createdAt).toLocaleString(locale)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w.status === "PENDING" && (
                          <>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "APPROVED")} className="rounded border border-emerald-500/50 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10">
                              {labels.approve}
                            </button>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "REJECTED")} className="rounded border border-red-500/50 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                              {labels.reject}
                            </button>
                          </>
                        )}
                        {w.status === "APPROVED" && (
                          <button type="button" onClick={() => updateWithdrawal(w.id, "COMPLETED")} className="rounded border border-cyber-cyan/50 px-3 py-1 text-xs text-cyber-cyan">
                            {labels.complete}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-cyber-border bg-cyber-dark/50 p-4 text-sm">
                      <p className="text-gray-500">{labels.recipientName}: <span className="text-white">{w.bankAccount.recipientName}</span></p>
                      <p className="text-gray-500">IBAN: <span className="font-mono text-white">{w.bankAccount.iban}</span></p>
                      <p className="text-gray-500">BIC: <span className="font-mono text-white">{w.bankAccount.bic}</span></p>
                      {w.clientNote && <p className="mt-2 text-gray-400">{labels.clientNote}: {w.clientNote}</p>}
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
