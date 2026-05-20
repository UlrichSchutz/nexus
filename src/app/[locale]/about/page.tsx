import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const cards = [
    {
      title: "Wealth Management",
      desc:
        locale === "de"
          ? "Individuelle Vermögensstrategien und Portfoliooptimierung."
          : "Individual wealth strategies and portfolio optimisation.",
    },
    {
      title: locale === "de" ? "Technologie" : "Technology",
      desc:
        locale === "de"
          ? "Sichere Banking-Systeme und skalierbare IT-Infrastruktur."
          : "Secure banking systems and scalable IT infrastructure.",
    },
    {
      title: locale === "de" ? "Compliance" : "Compliance",
      desc:
        locale === "de"
          ? "FINMA-orientierte Beratung und Datensicherheit."
          : "FINMA-oriented advisory and data security.",
    },
  ];

  return (
    <section className="page-shell">
      <div className="container mx-auto px-4">
        <PageHero title={t("title")} subtitle={t("subtitle")} />
        <div className="prose-section mx-auto mb-12 max-w-3xl text-center">
          <h2>{t("companyTitle")}</h2>
          <p>{t("companyText")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="glass-panel border-l-4 border-l-brand-teal p-8">
              <h3 className="mb-3 font-serif text-xl font-bold text-brand-ink">{c.title}</h3>
              <p className="text-sm leading-relaxed text-brand-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
