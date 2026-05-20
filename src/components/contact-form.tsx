"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          locale,
          company: form.get("company"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel mx-auto max-w-xl space-y-5 rounded-2xl p-8">
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      {status === "ok" && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-800">{t("success")}</p>
      )}
      {status === "err" && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">{t("error")}</p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <input name="firstName" required placeholder={t("firstName")} className="tech-input" />
        <input name="lastName" required placeholder={t("lastName")} className="tech-input" />
      </div>
      <input name="email" type="email" required placeholder={t("email")} className="tech-input" />
      <input name="phone" type="tel" required placeholder={t("phone")} className="tech-input" />
      <textarea name="message" required rows={5} placeholder={t("message")} className="tech-input resize-y" />
      <button type="submit" disabled={loading} className="btn-cyber w-full disabled:opacity-60">
        {loading ? "..." : t("submit")}
      </button>
    </form>
  );
}
