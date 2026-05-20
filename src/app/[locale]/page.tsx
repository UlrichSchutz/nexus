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
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <>
      <header className="hero-bg relative pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container relative z-10 mx-auto flex flex-col items-center gap-12 px-4 lg:flex-row">
          <div className="lg:w-3/5">
            <div className="trust-badge mb-6">{t("badge")}</div>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-brand-ink md:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleHighlight")}</span> {t("titleEnd")}
            </h1>
            <p className="mb-8 max-w-2xl border-l-4 border-brand-teal pl-5 text-lg leading-relaxed text-brand-muted md:text-xl">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#form" className="btn-cyber">
                {t("heroCta")}
              </Link>
              <Link href="/contact" className="btn-outline">
                {locale === "de" ? "Kontakt" : "Contact"}
              </Link>
            </div>
            <div className="mt-8 inline-block rounded-2xl border border-brand-border bg-white p-6 shadow-card">
              <div className="flex h-36 w-full max-w-md items-center gap-6 rounded-xl bg-gradient-to-br from-brand-tealLight to-white px-8 md:h-44">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-teal text-3xl text-white shadow-soft">
                  €
                </div>
                <div className="text-left">
                  <p className="font-serif text-lg font-bold text-brand-ink">
                    {locale === "de" ? "Forensik & Auszahlung in EUR" : "Forensics & EUR payouts"}
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">
                    {locale === "de"
                      ? "Sichere Banküberweisung auf Ihre IBAN"
                      : "Secure bank transfer to your IBAN"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5" id="form">
            <div className="glass-panel p-8 md:p-10">
              <h2 className="mb-2 text-center font-display text-2xl font-bold text-brand-ink">
                {t("formTitle")}
              </h2>
              <p className="mb-6 text-center text-sm text-brand-muted">
                {locale === "de"
                  ? "Kostenlose Ersteinschätzung — vertraulich & unverbindlich"
                  : "Free initial assessment — confidential & non-binding"}
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-brand-border bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              locale === "de" ? "Schweizer Expertise" : "Swiss expertise",
              locale === "de" ? "Vertrauliche Beratung" : "Confidential advice",
              locale === "de" ? "FINMA-orientiert" : "FINMA-oriented",
              locale === "de" ? "DE / EN Support" : "DE / EN support",
            ].map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-brand-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tealLight text-brand-teal">✓</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt border-y border-brand-border py-20" id="about">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-16 md:flex-row">
            <div className="rounded-2xl border border-brand-border bg-brand-canvas p-8 md:w-1/2">
              <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-soft">
                <span className="font-display text-6xl text-brand-teal/30">◈</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-6 font-display text-3xl font-bold text-brand-ink md:text-4xl">
                <span className="gradient-text">{t("aboutTitle")}</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-brand-muted">{t("aboutText")}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="glass-panel border-l-4 border-l-brand-teal p-5">
                  <h4 className="font-display font-bold text-brand-ink">{t("blockchain")}</h4>
                  <p className="mt-2 text-sm text-brand-muted">{t("blockchainDesc")}</p>
                </div>
                <div className="glass-panel border-l-4 border-l-brand-tealDark p-5">
                  <h4 className="font-display font-bold text-brand-ink">{t("identification")}</h4>
                  <p className="mt-2 text-sm text-brand-muted">{t("identificationDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-canvas py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-brand-ink md:text-4xl">
              {t("stepsTitle")}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-brand-teal" />
            <p className="mt-6 text-brand-muted">{t("stepsSubtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="glass-panel flex h-full flex-col p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal font-display text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-brand-ink">{step.title}</h3>
                <p className="flex-grow text-sm text-brand-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteCta title={t("ctaTitle")} subtitle={t("ctaSubtitle")} locale={locale} />

      <section className="section-alt py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-brand-ink">
            {t("overviewTitle")}
          </h2>
          <div className="glass-panel mb-20 overflow-hidden">
            <table className="w-full border-collapse text-left text-sm md:text-base">
              <tbody>
                {[
                  [t("consultFree")],
                  [t("analysisDuration")],
                  [t("assets")],
                  [t("availability")],
                ].map(([val], i) => (
                  <tr key={i} className="border-b border-brand-border transition hover:bg-brand-canvas">
                    <td className="p-4 font-medium text-brand-teal md:p-6">✓</td>
                    <td className="p-4 text-brand-muted md:p-6">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-brand-ink">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel border-l-4 border-l-brand-teal p-6"
              >
                <h3 className="mb-2 font-display text-lg font-bold text-brand-ink">{faq.q}</h3>
                <p className="text-sm text-brand-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
