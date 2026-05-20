"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";

const locales = [
  { code: "de" as const, label: "DE", flag: "🇩🇪" },
  { code: "en" as const, label: "EN", flag: "🇬🇧" },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchLocale(next: "de" | "en") {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  const linkClass =
    "text-brand-muted transition hover:text-brand-teal";

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/95 shadow-soft backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal font-display text-lg font-bold text-white shadow-soft">
            NT
          </div>
          <span className="hidden font-serif text-xl font-bold text-brand-ink sm:block">
            Nexus <span className="text-brand-teal">Tech</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/#about" className={linkClass}>
            {t("procedure")}
          </Link>
          <Link href="/about" className={linkClass}>
            {t("about")}
          </Link>
          <Link href="/services" className={linkClass}>
            {t("services")}
          </Link>
          <Link href="/contact" className={linkClass}>
            {t("contact")}
          </Link>
          <Link href="/#form" className="btn-cyber !px-5 !py-2 !text-xs">
            {t("freeConsultation")}
          </Link>
          <Link href="/portal" className={linkClass}>
            {t("clientPortal")}
          </Link>
          <div className="flex gap-1 rounded-lg border border-brand-border bg-brand-canvasAlt p-1 text-xs">
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => switchLocale(l.code)}
                className={`rounded-md px-2 py-1 transition ${
                  locale === l.code
                    ? "bg-brand-teal text-white"
                    : "text-brand-muted hover:text-brand-ink"
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="text-2xl text-brand-teal md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-border bg-white px-4 py-4 text-sm md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/#about" onClick={() => setOpen(false)} className={linkClass}>
              {t("procedure")}
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className={linkClass}>
              {t("about")}
            </Link>
            <Link href="/services" onClick={() => setOpen(false)} className={linkClass}>
              {t("services")}
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className={linkClass}>
              {t("contact")}
            </Link>
            <Link href="/portal" onClick={() => setOpen(false)} className={linkClass}>
              {t("clientPortal")}
            </Link>
            <div className="flex gap-2 pt-2">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className="rounded-lg border border-brand-border px-3 py-1"
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
