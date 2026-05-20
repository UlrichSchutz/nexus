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
          ? "Ungültige Anmeldedaten. Passwort steht in .env als ADMIN_PASSWORD (nach Änderung: npm run db:seed)."
          : "Invalid credentials. Password is ADMIN_PASSWORD in .env (after changes run: npm run db:seed)."
      );
      setLoading(false);
      return;
    }

    window.location.href = res?.url ?? callbackUrl;
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8">
        <h1 className="mb-6 text-center font-tech text-2xl font-bold text-white">
          {t("loginTitle")}
        </h1>
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
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-cyber w-full">
            {loading ? "..." : t("login")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="text-cyber-cyan hover:underline">
            ← {locale === "de" ? "Startseite" : "Home"}
          </Link>
        </p>
      </div>
    </section>
  );
}
