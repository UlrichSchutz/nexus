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
  const [showPassword, setShowPassword] = useState(false);
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-canvas via-white to-brand-primaryLight/5 px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-primaryLight/10 blur-3xl" />

      <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
        <div className="glass-panel w-full max-w-md overflow-hidden rounded-3xl border border-brand-border/40 p-10 shadow-lift backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-primaryLight font-display text-2xl font-bold text-white shadow-glow">
              🔐
            </div>
            <h1 className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text font-display text-3xl font-bold text-transparent">
              {t("loginTitle")}
            </h1>
            <p className="mt-3 text-sm font-medium text-brand-muted">
              {locale === "de"
                ? "Sicherer Zugang für Kunden & Administratoren"
                : "Secure access for clients & administrators"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="tech-input transition duration-200 placeholder:text-brand-light focus:ring-brand-accent"
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="tech-input w-full pr-12 transition duration-200 placeholder:text-brand-light focus:ring-brand-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-brand-muted transition-all duration-200 hover:bg-brand-canvas hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 13.576l1.414 1.414A10.016 10.016 0 0020.458 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-2.742.384l1.286 1.286A8 8 0 0115.17 13.576z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="space-y-2 rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-center">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber w-full bg-gradient-to-r from-brand-accent to-brand-primaryLight shadow-glow hover:shadow-glow hover:shadow-brand-accent/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {locale === "de" ? "Wird angemeldet..." : "Signing in..."}
                </span>
              ) : (
                <span>{t("login")} →</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-xs text-brand-light">or</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>

          {/* Back to Home Link */}
          <p className="text-center text-sm text-brand-muted">
            {locale === "de" ? "Zurück zur " : "Back to "}
            <Link href="/" className="font-semibold text-brand-accent transition hover:text-brand-accentDark hover:underline">
              {locale === "de" ? "Startseite" : "Home"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
