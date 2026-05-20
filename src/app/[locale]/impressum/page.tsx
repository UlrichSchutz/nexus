import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/page-hero";
import { siteContact } from "@/lib/site-config";

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
            {siteContact.companyName}
            <br />
            {siteContact.tagline}
            <br />
            {siteContact.location}
          </p>
          <h2>{de ? siteContact.representativeRole.de : siteContact.representativeRole.en}</h2>
          <p>{siteContact.representative}</p>
          <h2>{de ? "Kontakt" : "Contact"}</h2>
          <p>
            Tel: {siteContact.phone}
            <br />
            E-Mail:{" "}
            <a href={`mailto:${siteContact.email}`} className="text-brand-teal hover:underline">
              {siteContact.email}
            </a>
            <br />
            Web: {siteContact.web}
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
