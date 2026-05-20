"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/routing";

type Client = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  active: boolean;
  createdAt: string;
  balance: {
    btcAmount: string;
    eurAmount: string;
    systemNotice: string | null;
    note: string | null;
  } | null;
  bankAccount?: { iban: string } | null;
};

type Withdrawal = {
  id: string;
  eurAmount: string;
  status: string;
  clientNote: string | null;
  adminNote: string | null;
  createdAt: string;
  user: { email: string; firstName: string | null; lastName: string | null };
  bankAccount: { recipientName: string; iban: string; bic: string };
};

type ClientEdit = {
  btc: string;
  eur: string;
  systemNotice: string;
  note: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  active: boolean;
};

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
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [lastReset, setLastReset] = useState<{ email: string; password: string } | null>(null);
  const [flash, setFlash] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
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
          firstName: c.firstName ?? "",
          lastName: c.lastName ?? "",
          phone: c.phone ?? "",
          email: c.email,
          active: c.active,
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
      setLastReset({ email: form.email, password: form.password });
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

  async function patchClient(userId: string, payload: Record<string, unknown>) {
    const res = await fetch(`/api/admin/clients/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
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
    setFlash(labels.balanceSaved);
    load();
  }

  async function saveProfile(userId: string) {
    const edit = edits[userId];
    if (!edit) return;
    const ok = await patchClient(userId, {
      email: edit.email,
      firstName: edit.firstName,
      lastName: edit.lastName,
      phone: edit.phone || null,
      active: edit.active,
    });
    setFlash(ok ? labels.profileSaved : labels.saveError);
    if (ok) load();
  }

  async function resetPassword(userId: string) {
    const pwd = newPasswords[userId]?.trim();
    if (!pwd || pwd.length < 8) {
      setFlash(labels.passwordTooShort);
      return;
    }
    const edit = edits[userId];
    const res = await fetch(`/api/admin/clients/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: pwd }),
    });
    if (res.ok) {
      setLastReset({ email: edit?.email ?? "", password: pwd });
      setNewPasswords((p) => ({ ...p, [userId]: "" }));
      setFlash(labels.passwordReset);
    } else setFlash(labels.saveError);
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
  const activeClients = clients.filter((c) => c.active).length;

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl font-bold text-brand-ink">{labels.title}</h1>
          <div className="flex gap-3">
            <Link href="/portal" className="text-sm text-brand-teal hover:underline">
              {labels.clientPortal}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="text-sm text-brand-muted hover:text-brand-teal"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs uppercase text-brand-muted">{labels.totalClients}</p>
            <p className="mt-1 font-serif text-3xl font-bold text-brand-teal">{clients.length}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs uppercase text-brand-muted">{labels.activeClients}</p>
            <p className="mt-1 font-serif text-3xl font-bold text-brand-ink">{activeClients}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs uppercase text-brand-muted">{labels.pendingWithdrawals}</p>
            <p className="mt-1 font-serif text-3xl font-bold text-amber-700">{pendingCount}</p>
          </div>
        </div>

        {lastReset && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">{labels.passwordCopyHint}</p>
            <p className="mt-2 font-mono">
              {labels.email}: {lastReset.email}
              <br />
              {labels.password}: {lastReset.password}
            </p>
            <button type="button" className="mt-3 text-xs text-brand-teal underline" onClick={() => setLastReset(null)}>
              {labels.dismiss}
            </button>
          </div>
        )}

        {flash && (
          <p className="mb-6 rounded-lg border border-brand-teal/30 bg-brand-tealLight p-3 text-sm text-brand-tealDark">
            {flash}
            <button type="button" className="ml-3 underline" onClick={() => setFlash("")}>
              ×
            </button>
          </p>
        )}

        <div className="mb-8 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("clients")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${
              tab === "clients" ? "bg-brand-teal text-white" : "border border-brand-border text-brand-muted"
            }`}
          >
            {labels.clients}
          </button>
          <button
            type="button"
            onClick={() => setTab("withdrawals")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${
              tab === "withdrawals" ? "bg-brand-teal text-white" : "border border-brand-border text-brand-muted"
            }`}
          >
            {labels.withdrawals}
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs text-amber-950">{pendingCount}</span>
            )}
          </button>
        </div>

        {tab === "clients" && (
          <>
            <div className="glass-panel mb-8 rounded-2xl p-6 md:p-8">
              <h2 className="mb-6 font-serif text-xl font-bold text-brand-teal">+ {labels.createClient}</h2>
              <form onSubmit={createClient} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <input className="tech-input" placeholder={labels.email} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="tech-input" placeholder={labels.password} type="text" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <input className="tech-input" placeholder={labels.firstName} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input className="tech-input" placeholder={labels.lastName} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input className="tech-input" placeholder={labels.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="tech-input" placeholder={labels.btcBalance} type="number" step="0.00000001" min="0" value={form.btcAmount} onChange={(e) => setForm({ ...form, btcAmount: e.target.value })} />
                <input className="tech-input" placeholder={`${labels.eurBalance} (0 = Marktkurs)`} type="number" step="0.01" min="0" value={form.eurAmount} onChange={(e) => setForm({ ...form, eurAmount: e.target.value })} />
                <input className="tech-input lg:col-span-2" placeholder={labels.systemNotice} value={form.systemNotice} onChange={(e) => setForm({ ...form, systemNotice: e.target.value })} />
                <button type="submit" className="btn-cyber">{labels.createClient}</button>
              </form>
            </div>

            {loading ? (
              <p className="text-center text-brand-muted">...</p>
            ) : (
              <div className="space-y-6">
                {clients.map((c) => {
                  const edit = edits[c.id];
                  if (!edit) return null;
                  return (
                    <div key={c.id} className="glass-panel rounded-2xl p-6">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg font-bold text-brand-ink">
                            {edit.firstName} {edit.lastName}
                          </p>
                          <p className="text-sm text-brand-muted">{edit.email}</p>
                          <p className="text-xs text-brand-light">
                            {labels.memberSince}: {new Date(c.createdAt).toLocaleDateString(locale)}
                            {c.bankAccount ? ` · IBAN ✓` : ""}
                          </p>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={edit.active}
                            onChange={(e) =>
                              setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], active: e.target.checked } }))
                            }
                          />
                          {labels.active}
                        </label>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-3 rounded-xl border border-brand-border bg-brand-canvas/50 p-4">
                          <h3 className="text-xs font-semibold uppercase text-brand-teal">{labels.profileSection}</h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input className="tech-input text-sm" value={edit.firstName} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], firstName: e.target.value } }))} />
                            <input className="tech-input text-sm" value={edit.lastName} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], lastName: e.target.value } }))} />
                            <input className="tech-input text-sm sm:col-span-2" type="email" value={edit.email} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], email: e.target.value } }))} />
                            <input className="tech-input text-sm sm:col-span-2" placeholder={labels.phone} value={edit.phone} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], phone: e.target.value } }))} />
                          </div>
                          <button type="button" onClick={() => saveProfile(c.id)} className="btn-outline !py-2 !text-xs">
                            {labels.saveProfile}
                          </button>
                        </div>

                        <div className="space-y-3 rounded-xl border border-brand-border bg-brand-canvas/50 p-4">
                          <h3 className="text-xs font-semibold uppercase text-brand-teal">{labels.passwordSection}</h3>
                          <p className="text-xs text-brand-muted">{labels.passwordStored}</p>
                          <div className="flex gap-2">
                            <input
                              className="tech-input flex-1 text-sm font-mono"
                              type={showPassword[c.id] ? "text" : "password"}
                              placeholder={labels.newPasswordPlaceholder}
                              minLength={8}
                              value={newPasswords[c.id] ?? ""}
                              onChange={(e) => setNewPasswords((p) => ({ ...p, [c.id]: e.target.value }))}
                            />
                            <button
                              type="button"
                              className="rounded border border-brand-border px-3 text-xs text-brand-teal"
                              onClick={() => setShowPassword((s) => ({ ...s, [c.id]: !s[c.id] }))}
                            >
                              {showPassword[c.id] ? labels.hide : labels.show}
                            </button>
                          </div>
                          <button type="button" onClick={() => resetPassword(c.id)} className="btn-cyber !py-2 !text-xs">
                            {labels.resetPassword}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 rounded-xl border border-brand-border p-4 sm:grid-cols-2 lg:grid-cols-4">
                        <input type="number" step="0.00000001" className="tech-input text-sm" placeholder={labels.btcBalance} value={edit.btc} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], btc: e.target.value } }))} />
                        <input type="number" step="0.01" className="tech-input text-sm" placeholder={labels.eurBalance} value={edit.eur} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], eur: e.target.value } }))} />
                        <textarea className="tech-input min-h-[60px] text-xs lg:col-span-2" placeholder={labels.systemNotice} value={edit.systemNotice} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], systemNotice: e.target.value } }))} />
                        <input className="tech-input text-sm lg:col-span-2" placeholder={labels.note} value={edit.note} onChange={(e) => setEdits((p) => ({ ...p, [c.id]: { ...p[c.id], note: e.target.value } }))} />
                        <button type="button" onClick={() => saveBalance(c.id)} className="btn-cyber !py-2 !text-xs lg:col-span-2">
                          {labels.saveBalance}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "withdrawals" && (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <h2 className="border-b border-brand-border p-6 font-serif text-xl font-bold text-brand-ink">
              {labels.withdrawals}
            </h2>
            {loading ? (
              <p className="p-8 text-center text-brand-muted">...</p>
            ) : withdrawals.length === 0 ? (
              <p className="p-8 text-center text-brand-muted">{labels.noWithdrawals}</p>
            ) : (
              <div className="divide-y divide-brand-border/50">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-lg text-brand-ink">
                          {Number(w.eurAmount).toLocaleString(locale, { style: "currency", currency: "EUR" })}
                          <span
                            className={`ml-3 rounded px-2 py-0.5 text-xs ${
                              w.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : w.status === "REJECTED"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            {w.status}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-brand-muted">
                          {w.user.firstName} {w.user.lastName} · {w.user.email}
                        </p>
                        <p className="mt-1 text-xs text-brand-light">{new Date(w.createdAt).toLocaleString(locale)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w.status === "PENDING" && (
                          <>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "APPROVED")} className="rounded border border-emerald-500/50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50">
                              {labels.approve}
                            </button>
                            <button type="button" onClick={() => updateWithdrawal(w.id, "REJECTED")} className="rounded border border-red-500/50 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
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
                      <p className="text-brand-muted">
                        {labels.recipientName}: <span className="text-brand-ink">{w.bankAccount.recipientName}</span>
                      </p>
                      <p className="text-brand-muted">
                        IBAN: <span className="font-mono text-brand-ink">{w.bankAccount.iban}</span>
                      </p>
                      <p className="text-brand-muted">
                        BIC: <span className="font-mono text-brand-ink">{w.bankAccount.bic}</span>
                      </p>
                      {w.clientNote && (
                        <p className="mt-2 text-brand-muted">
                          {labels.clientNote}: {w.clientNote}
                        </p>
                      )}
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
