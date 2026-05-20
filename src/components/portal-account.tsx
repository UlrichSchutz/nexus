"use client";

import { useEffect, useState } from "react";

type Profile = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};

export function PortalAccount({ labels, locale }: { labels: Record<string, string>; locale: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.profile) {
          setProfile(data.profile);
          setFirstName(data.profile.firstName ?? "");
          setLastName(data.profile.lastName ?? "");
          setPhone(data.profile.phone ?? "");
        }
        setLoading(false);
      });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phone }),
    });
    if (res.ok) {
      setMsg(labels.profileSaved);
      const data = await res.json();
      setProfile(data.profile);
    } else setErr(labels.profileError);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (newPassword !== confirmPassword) {
      setErr(labels.passwordMismatch);
      return;
    }
    if (newPassword.length < 8) {
      setErr(labels.passwordTooShort);
      return;
    }
    const res = await fetch("/api/portal/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg(labels.passwordChanged);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErr(
        data.error === "Current password is incorrect"
          ? labels.passwordWrong
          : data.error === "New password must be different"
            ? labels.passwordSame
            : labels.passwordError
      );
    }
  }

  if (loading) {
    return <p className="text-brand-muted">{labels.loading}</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="mb-2 font-serif text-xl font-bold text-brand-ink">{labels.profileTitle}</h2>
        <p className="mb-6 text-sm text-brand-muted">{labels.profileDesc}</p>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-muted">{labels.email}</label>
            <input className="tech-input bg-brand-canvasAlt" value={profile?.email ?? ""} disabled />
            <p className="mt-1 text-xs text-brand-light">{labels.emailReadonly}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="tech-input" placeholder={labels.firstName} required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="tech-input" placeholder={labels.lastName} required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <input className="tech-input" placeholder={labels.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit" className="btn-cyber w-full sm:w-auto">
            {labels.saveProfile}
          </button>
        </form>
      </div>

      <div className="glass-panel rounded-2xl border border-brand-teal/20 p-6 md:p-8">
        <h2 className="mb-2 font-serif text-xl font-bold text-brand-ink">{labels.passwordTitle}</h2>
        <p className="mb-6 text-sm text-brand-muted">{labels.passwordDesc}</p>
        <form onSubmit={changePassword} className="space-y-4">
          <input
            className="tech-input"
            type="password"
            placeholder={labels.currentPassword}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className="relative">
            <input
              className="tech-input pr-12"
              type={showNew ? "text" : "password"}
              placeholder={labels.newPassword}
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-teal"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? labels.hide : labels.show}
            </button>
          </div>
          <input
            className="tech-input"
            type={showNew ? "text" : "password"}
            placeholder={labels.confirmPassword}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button type="submit" className="btn-cyber w-full sm:w-auto">
            {labels.changePassword}
          </button>
        </form>
      </div>

      {(msg || err) && (
        <div className="lg:col-span-2">
          {msg && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{msg}</p>}
          {err && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{err}</p>}
        </div>
      )}
    </div>
  );
}
