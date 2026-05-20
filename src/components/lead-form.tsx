"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

export function LeadForm() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") ?? "");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) {
      setError(locale === "de" ? "Bitte gültige Telefonnummer eingeben." : "Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          phone,
          locale,
          website: form.get("website"),
        }),
      });

      if (!res.ok) throw new Error("failed");
      router.push("/thank-you");
    } catch {
      setError(locale === "de" ? "Übermittlung fehlgeschlagen." : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative z-10 space-y-5" id="registerForm">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <input name="firstName" placeholder={t("firstName")} required className="tech-input" />
        <input name="lastName" placeholder={t("lastName")} required className="tech-input" />
      </div>
      <input name="email" type="email" placeholder={t("email")} required className="tech-input" />
      <input
        name="phone"
        type="tel"
        placeholder={t("phone")}
        required
        pattern="^\+?[0-9\s\-\(\)]{8,20}$"
        className="tech-input"
      />
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-800 bg-cyber-dark/50 p-3 text-xs text-gray-400">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-cyber-cyan" />
        <span className="leading-relaxed">{t("consent")}</span>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-cyber w-full disabled:opacity-60">
        {loading ? "..." : t("submit")} →
      </button>
    </form>
  );
}
