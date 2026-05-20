import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";

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
      <header className="hero-bg relative pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="container relative z-10 mx-auto flex flex-col items-center gap-12 px-4 lg:flex-row">
          <div className="lg:w-3/5">
            <div className="mb-6 inline-block rounded border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-1.5 font-tech text-xs font-bold uppercase tracking-widest text-cyber-cyan backdrop-blur-sm">
              🛡 {t("badge")}
            </div>
            <h1 className="mb-6 font-tech text-4xl font-bold leading-tight text-white md:text-6xl">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleHighlight")}</span>{" "}
              {t("titleEnd")}
            </h1>
            <p className="mb-8 max-w-2xl border-l-2 border-cyber-cyan pl-4 text-lg leading-relaxed text-gray-300 md:text-xl">
              {t("subtitle")}
            </p>
            <div className="scanner-container inline-block rounded-xl border border-cyber-cyan/30 bg-cyber-dark/50 p-1">
              <div className="flex h-48 w-full max-w-lg items-center justify-center rounded-lg bg-gradient-to-br from-cyber-panel to-cyber-dark md:h-64">
                <div className="text-center font-tech text-cyber-cyan/80">
                  <div className="text-4xl font-bold">₿</div>
                  <p className="mt-2 text-sm uppercase tracking-widest">Blockchain Analysis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5" id="form">
            <div className="glass-panel group relative overflow-hidden rounded-2xl p-8 md:p-10">
              <h2 className="mb-6 flex items-center justify-center gap-3 text-center font-tech text-2xl font-bold text-white">
                📋 {t("formTitle")}
              </h2>
              <LeadForm />
            </div>
          </div>
        </div>
      </header>

      <section className="relative border-t border-cyber-border py-20" id="about">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-16 md:flex-row">
            <div className="scanner-container rounded-2xl border border-cyber-border bg-cyber-panel p-1 md:w-1/2">
              <div className="flex h-64 items-center justify-center rounded-xl bg-cyber-dark/80">
                <span className="font-tech text-6xl text-cyber-cyan/30">◈</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-6 font-tech text-3xl font-bold gradient-text md:text-4xl">
                {t("aboutTitle")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-300">{t("aboutText")}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="glass-panel rounded-lg border-l-4 border-l-cyber-cyan p-5">
                  <h4 className="font-tech font-bold text-white">⛓ {t("blockchain")}</h4>
                  <p className="mt-2 text-sm text-gray-400">{t("blockchainDesc")}</p>
                </div>
                <div className="glass-panel rounded-lg border-l-4 border-l-cyber-blue p-5">
                  <h4 className="font-tech font-bold text-white">🔍 {t("identification")}</h4>
                  <p className="mt-2 text-sm text-gray-400">{t("identificationDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cyber-border bg-cyber-panel py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-tech text-3xl font-bold md:text-4xl">{t("stepsTitle")}</h2>
            <div className="mx-auto h-1 w-24 rounded bg-cyber-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
            <p className="mt-6 text-gray-400">{t("stepsSubtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="glass-panel neon-border flex h-full flex-col rounded-xl p-6">
                <div className="mb-4 font-tech text-3xl text-cyber-cyan">{i + 1}</div>
                <h3 className="mb-3 font-tech text-xl font-bold text-white">{step.title}</h3>
                <p className="flex-grow text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center font-tech text-3xl font-bold">{t("overviewTitle")}</h2>
          <div className="glass-panel mb-20 overflow-hidden rounded-xl border border-cyber-border">
            <table className="w-full border-collapse text-left text-sm md:text-base">
              <tbody>
                {[
                  ["⏱", t("consultFree")],
                  ["📄", t("analysisDuration")],
                  ["🪙", t("assets")],
                  ["🌐", t("availability")],
                ].map(([icon, val], i) => (
                  <tr key={i} className="border-b border-cyber-border transition hover:bg-white/5">
                    <td className="w-1/3 p-4 font-bold text-cyber-cyan md:p-6">{icon}</td>
                    <td className="p-4 text-gray-300 md:p-6">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mb-8 text-center font-tech text-3xl font-bold">{t("faqTitle")}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`glass-panel rounded-lg border-l-2 p-6 ${i % 2 === 0 ? "border-l-cyber-cyan" : "border-l-cyber-blue"}`}
              >
                <h3 className="mb-2 text-lg font-bold text-white">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
