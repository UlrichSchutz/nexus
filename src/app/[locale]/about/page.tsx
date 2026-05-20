import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const cards = [
    { title: "Wealth Management", desc: locale === "de" ? "Individuelle Vermögensstrategien und Portfoliooptimierung." : "Individual wealth strategies and portfolio optimisation." },
    { title: locale === "de" ? "Technologie" : "Technology", desc: locale === "de" ? "Sichere Banking-Systeme und skalierbare IT-Infrastruktur." : "Secure banking systems and scalable IT infrastructure." },
    { title: locale === "de" ? "Compliance" : "Compliance", desc: locale === "de" ? "FINMA-orientierte Beratung und Datensicherheit." : "FINMA-oriented advisory and data security." },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-tech text-4xl font-bold text-white">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-gray-400">{t("subtitle")}</p>
        </div>
        <h2 className="mb-4 text-center font-tech text-2xl text-cyber-cyan">{t("companyTitle")}</h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-gray-300">{t("companyText")}</p>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="glass-panel neon-border rounded-2xl p-8">
              <h3 className="mb-3 font-tech text-xl font-bold text-white">{c.title}</h3>
              <p className="text-sm text-gray-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
