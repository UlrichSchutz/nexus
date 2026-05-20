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

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-cyber-border/50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 font-tech text-lg font-bold text-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,0.4)]">
            NT
          </div>
          <span className="hidden font-tech text-xl font-bold uppercase tracking-widest text-white sm:block">
            Nexus <span className="text-cyber-cyan">Tech</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 font-tech text-sm text-gray-300 md:flex">
          <Link href="/#about" className="transition hover:text-cyber-cyan">
            {t("procedure")}
          </Link>
          <Link href="/about" className="transition hover:text-cyber-cyan">
            {t("about")}
          </Link>
          <Link href="/services" className="transition hover:text-cyber-cyan">
            {t("services")}
          </Link>
          <Link href="/contact" className="transition hover:text-cyber-cyan">
            {t("contact")}
          </Link>
          <Link
            href="/#form"
            className="rounded border border-cyber-cyan bg-cyber-cyan/10 px-5 py-2 uppercase text-cyber-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)] transition hover:bg-cyber-cyan hover:text-cyber-dark"
          >
            {t("freeConsultation")}
          </Link>
          <Link href="/portal" className="transition hover:text-cyber-cyan">
            {t("clientPortal")}
          </Link>
          <div className="flex gap-1 rounded border border-gray-700 bg-cyber-dark px-1 py-1 text-xs">
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => switchLocale(l.code)}
                className={`rounded px-2 py-1 ${locale === l.code ? "bg-cyber-cyan/20 text-cyber-cyan" : "text-gray-400 hover:text-white"}`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="text-2xl text-cyber-cyan md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-cyber-border/50 px-4 py-4 font-tech text-sm md:hidden">
          <div className="flex flex-col gap-3 text-gray-300">
            <Link href="/#about" onClick={() => setOpen(false)}>
              {t("procedure")}
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              {t("about")}
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              {t("services")}
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
            <Link href="/portal" onClick={() => setOpen(false)}>
              {t("clientPortal")}
            </Link>
            <div className="flex gap-2 pt-2">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className="rounded border border-gray-700 px-3 py-1"
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
