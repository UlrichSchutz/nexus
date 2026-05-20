import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/page-hero";

type Props = { params: Promise<{ locale: string }> };

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <section className="page-shell">
      <div className="container mx-auto max-w-3xl px-4">
        <PageHero title={de ? "Impressum" : "Legal notice"} />
        <div className="prose-section">
          <h2>{de ? "Unternehmensangaben" : "Company"}</h2>
          <p>
            Nexus Tech CH
            <br />
            Wealth Management & IT Systems
            <br />
            Bern, Schweiz
          </p>
          <h2>{de ? "Kontakt" : "Contact"}</h2>
          <p>
            Tel: +44 7451 250055
            <br />
            Web: nexus-tech.info
            <br />
            E-Mail: info@nexus-tech.info
          </p>
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/" className="font-medium text-brand-teal hover:underline">
            ← {de ? "Startseite" : "Home"}
          </Link>
        </p>
      </div>
    </section>
  );
}
