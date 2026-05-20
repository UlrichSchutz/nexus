import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";

type Props = { params: Promise<{ locale: string }> };

const servicesDe = [
  ["Strategisches Wealth Management", "Portfolio-Strategien, Asset Allocation, ESG."],
  ["Digitale Banking-Systeme", "Core-Banking, Reporting, APIs."],
  ["Cyber Security", "Zero-Trust, Penetrationstests, Monitoring."],
  ["Compliance & Regulatorik", "FINMA, Risikoanalysen, Audits."],
  ["Private Client Solutions", "HNWI, Family Governance."],
  ["Digitale Transformation", "Cloud, Automatisierung, KI-Analyse."],
];

const servicesEn = [
  ["Strategic wealth management", "Portfolio strategies, allocation, ESG."],
  ["Digital banking systems", "Core banking, reporting, APIs."],
  ["Cyber security", "Zero-trust, penetration testing, monitoring."],
  ["Compliance & regulation", "FINMA, risk analysis, audits."],
  ["Private client solutions", "HNWI, family governance."],
  ["Digital transformation", "Cloud, automation, AI analytics."],
];

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const items = locale === "de" ? servicesDe : servicesEn;

  return (
    <section className="page-shell">
      <div className="container mx-auto px-4">
        <PageHero title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc]) => (
            <div key={title} className="glass-panel p-8 transition hover:shadow-lift">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tealLight font-serif text-lg font-bold text-brand-teal">
                ✓
              </div>
              <h3 className="mb-3 font-serif text-lg font-bold text-brand-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-brand-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
