import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LeadForm } from "@/components/lead-form";
import { SiteCta } from "@/components/site-cta";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const faqs = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
  ];

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc"), icon: "🔍" },
    { title: t("step2Title"), desc: t("step2Desc"), icon: "🛡️" },
    { title: t("step3Title"), desc: t("step3Desc"), icon: "💰" },
  ];

  const features = [
    {
      icon: "⛓️",
      title: locale === "de" ? "Blockchain-Forensik" : "Blockchain Forensics",
      desc: locale === "de"
        ? "Tiefgreifende Analyse von Transaktionen und digitalen Vermögenswerten"
        : "In-depth analysis of transactions and digital assets",
    },
    {
      icon: "🔐",
      title: locale === "de" ? "Sichere Recovery" : "Secure Recovery",
      desc: locale === "de"
        ? "Spezialisierte Techniken zur Wiederherstellung von Vermögenswerten"
        : "Specialized techniques for asset recovery",
    },
    {
      icon: "📊",
      title: locale === "de" ? "Vermögensmanagement" : "Wealth Management",
      desc: locale === "de"
        ? "Professionelle Verwaltung und Optimierung Ihres Portfolios"
        : "Professional portfolio management and optimization",
    },
    {
      icon: "🤝",
      title: locale === "de" ? "Persönliche Beratung" : "Personal Advisory",
      desc: locale === "de"
        ? "Individualisierte Strategien für Ihre einzigartigen Bedürfnisse"
        : "Tailored strategies for your unique needs",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <header className="hero-bg relative overflow-hidden pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="container relative z-10 mx-auto flex flex-col items-center gap-16 px-4 lg:flex-row lg:gap-12">
          {/* Left Content */}
          <div className="lg:w-3/5">
            <div className="trust-badge mb-6 animate-fadeIn">
              {t("badge")}
            </div>
            <h1 className="mb-6 animate-slideUp font-display text-5xl font-bold leading-tight text-brand-ink md:text-6xl lg:text-7xl">
              {t("title")}{" "}
              <span className="gradient-text block">{t("titleHighlight")}</span> {t("titleEnd")}
            </h1>
            <p className="mb-8 max-w-2xl animate-slideUp border-l-4 border-brand-accent pl-6 text-lg leading-relaxed text-brand-muted md:text-xl">
              {t("subtitle")}
            </p>
            <div className="mb-12 flex flex-wrap gap-4">
              <Link href="/#form" className="btn-cyber">
                {t("heroCta")} →
              </Link>
              <Link href="/contact" className="btn-outline">
                {locale === "de" ? "Kontaktieren Sie uns" : "Get in Touch"}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  label: locale === "de" ? "Forensik & EUR" : "Forensics & EUR",
                  value: "100%",
                },
                {
                  label: locale === "de" ? "Sicher" : "Secure",
                  value: "24/7",
                },
                {
                  label: locale === "de" ? "Schweizer" : "Swiss",
                  value: "CH",
                },
                {
                  label: locale === "de" ? "Vertraulich" : "Confidential",
                  value: "✓",
                },
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-4 text-center">
                  <div className="text-2xl font-bold text-brand-accent">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium text-brand-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-2/5" id="form">
            <div className="glass-panel p-10 shadow-lift md:p-12">
              <h2 className="mb-2 text-center font-display text-2xl font-bold text-brand-ink">
                {t("formTitle")}
              </h2>
              <p className="mb-8 text-center text-sm text-brand-muted">
                {locale === "de"
                  ? "Kostenlose Ersteinschätzung — vertraulich & unverbindlich"
                  : "Free initial assessment — confidential & non-binding"}
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </header>

      {/* Trust Badges Section */}
      <section className="border-b border-brand-border/40 bg-white py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { icon: "🏛️", label: locale === "de" ? "Schweizer Expertise" : "Swiss expertise" },
              { icon: "🔒", label: locale === "de" ? "Vertrauliche Beratung" : "Confidential advice" },
              { icon: "📋", label: locale === "de" ? "FINMA-orientiert" : "FINMA-oriented" },
              { icon: "🌍", label: locale === "de" ? "DE / EN Support" : "DE / EN support" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-sm font-semibold text-brand-muted">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="section-alt py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 font-display text-4xl font-bold text-brand-ink md:text-5xl">
              {locale === "de" ? "Unsere Dienstleistungen" : "Our Services"}
            </h2>
            <p className="text-lg text-brand-muted">
              {locale === "de"
                ? "Umfassende Lösungen für Kryptowährungen und digitale Vermögenswerte"
                : "Comprehensive solutions for cryptocurrencies and digital assets"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div key={i} className="glass-panel group flex flex-col p-6 text-center">
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-3 font-display text-lg font-bold text-brand-ink">
                  {feature.title}
                </h3>
                <p className="flex-grow text-sm text-brand-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-16 md:flex-row">
            {/* Visual Element - Using gradient background as placeholder for image */}
            <div className="md:w-1/2">
              <div className="glass-panel overflow-hidden rounded-3xl p-8">
                <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/10 via-brand-primaryLight/10 to-brand-cta/10">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">🔐</div>
                    <p className="text-sm font-bold text-brand-muted">
                      {locale === "de" ? "Sichere Blockchain-Technologie" : "Secure Blockchain Technology"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="md:w-1/2">
              <h2 className="mb-6 font-display text-4xl font-bold text-brand-ink md:text-5xl">
                <span className="gradient-text">{t("aboutTitle")}</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-brand-muted">{t("aboutText")}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="glass-panel border-l-4 border-l-brand-accent p-6">
                  <div className="mb-2 text-3xl">⛓️</div>
                  <h4 className="font-display font-bold text-brand-ink">{t("blockchain")}</h4>
                  <p className="mt-3 text-sm text-brand-muted">{t("blockchainDesc")}</p>
                </div>
                <div className="glass-panel border-l-4 border-l-brand-primaryLight p-6">
                  <div className="mb-2 text-3xl">🔍</div>
                  <h4 className="font-display font-bold text-brand-ink">{t("identification")}</h4>
                  <p className="mt-3 text-sm text-brand-muted">{t("identificationDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps/Process Section */}
      <section className="section-alt py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-brand-ink md:text-5xl">
              {t("stepsTitle")}
            </h2>
            <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-brand-accent to-brand-cta" />
            <p className="text-lg text-brand-muted">{t("stepsSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="glass-panel flex flex-col overflow-hidden p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-primaryLight text-3xl font-bold text-white shadow-glow">
                  {step.icon}
                </div>
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primaryLight text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-4 font-display text-xl font-bold text-brand-ink">{step.title}</h3>
                <p className="flex-grow text-sm leading-relaxed text-brand-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SiteCta title={t("ctaTitle")} subtitle={t("ctaSubtitle")} locale={locale} />

      {/* Comparison Table Section */}
      <section className="section-alt py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center font-display text-4xl font-bold text-brand-ink md:text-5xl">
            {t("overviewTitle")}
          </h2>

          <div className="glass-panel overflow-hidden">
            <table className="w-full border-collapse text-left text-sm md:text-base">
              <tbody>
                {[
                  [t("consultFree"), "✓"],
                  [t("analysisDuration"), "✓"],
                  [t("assets"), "✓"],
                  [t("availability"), "✓"],
                ].map(([label, check], i) => (
                  <tr key={i} className="border-b border-brand-border/40 transition hover:bg-brand-canvasAlt">
                    <td className="p-6 text-brand-accent">{check}</td>
                    <td className="p-6 font-medium text-brand-muted">{label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center font-display text-4xl font-bold text-brand-ink md:text-5xl">
            {t("faqTitle")}
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel border-l-4 border-l-brand-accent p-8 transition-all duration-300 hover:shadow-lift"
              >
                <h3 className="mb-3 font-display text-lg font-bold text-brand-ink">{faq.q}</h3>
                <p className="text-brand-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
