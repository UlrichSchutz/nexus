"use client";

import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function PortalLoginPage() {
  const t = useTranslations("portal");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/portal`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setError(
        locale === "de"
          ? "Ungültige Anmeldedaten. Bitte E-Mail und Passwort prüfen."
          : "Invalid credentials. Please check your email and password."
      );
      setLoading(false);
      return;
    }

    window.location.href = res?.url ?? callbackUrl;
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-brand-canvas px-4 py-20">
      <div className="glass-panel w-full max-w-md rounded-2xl border-brand-teal/20 p-8 shadow-lift">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal font-serif text-lg font-bold text-white">
            NT
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-ink">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {locale === "de" ? "Sicherer Zugang für Kunden & Administratoren" : "Secure access for clients & administrators"}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            required
            autoComplete="email"
            className="tech-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")}
            required
            autoComplete="current-password"
            className="tech-input"
          />
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-cyber w-full">
            {loading ? "..." : t("login")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-brand-muted">
          <Link href="/" className="font-medium text-brand-teal hover:underline">
            ← {locale === "de" ? "Startseite" : "Home"}
          </Link>
        </p>
      </div>
    </section>
  );
}
