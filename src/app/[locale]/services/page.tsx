import { getTranslations, setRequestLocale } from "next-intl/server";

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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="mb-4 text-center font-tech text-4xl font-bold text-white">{t("title")}</h1>
        <p className="mx-auto mb-16 max-w-2xl text-center text-gray-400">{t("subtitle")}</p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc]) => (
            <div key={title} className="glass-panel neon-border rounded-2xl p-8">
              <h3 className="mb-3 font-tech text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
