import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4 prose prose-invert">
        <h1 className="mb-8 font-tech text-4xl font-bold text-white">
          {de ? "Impressum" : "Legal notice"}
        </h1>
        <h2 className="font-tech text-xl text-cyber-cyan">{de ? "Unternehmensangaben" : "Company"}</h2>
        <p className="text-gray-300">
          Nexus Tech CH<br />
          Wealth Management & IT Systems<br />
          Bern, Schweiz
        </p>
        <h2 className="mt-8 font-tech text-xl text-cyber-cyan">{de ? "Kontakt" : "Contact"}</h2>
        <p className="text-gray-300">
          Tel: +44 7451 250055<br />
          Web: nexus-tech.info<br />
          E-Mail: info@nexus-tech.info
        </p>
        <p className="mt-8 text-sm text-gray-500">
          <Link href="/" className="text-cyber-cyan hover:underline">
            ← {de ? "Startseite" : "Home"}
          </Link>
        </p>
      </div>
    </section>
  );
}
