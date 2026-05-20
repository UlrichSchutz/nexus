import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/page-hero";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <section className="page-shell">
      <div className="container mx-auto max-w-3xl px-4">
        <PageHero title={de ? "Datenschutzerklärung" : "Privacy policy"} />
        <div className="prose-section">
          {de ? (
            <>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre
                Daten vertraulich gemäss Schweizer DSG und der EU-DSGVO.
              </p>
              <h2>Erhebung von Daten</h2>
              <p>
                Personenbezogene Daten werden nur erhoben, wenn Sie uns diese im Rahmen einer Kontakt-
                oder Fallanfrage freiwillig mitteilen (Name, E-Mail, Telefon, Nachricht).
              </p>
              <h2>Kundenportal</h2>
              <p>
                Für den Zugang zum Kundenportal speichern wir Login-Daten und den von Ihrem Berater
                freigegebenen Bitcoin-Saldo. Diese Daten sind nicht öffentlich zugänglich.
              </p>
              <h2>Ihre Rechte</h2>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten.
              </p>
            </>
          ) : (
            <>
              <p>
                We treat your personal data confidentially in accordance with Swiss FADP and the EU GDPR.
              </p>
              <h2>Data collection</h2>
              <p>
                We only collect personal data you voluntarily submit via contact or case forms (name, email,
                phone, message).
              </p>
              <h2>Client portal</h2>
              <p>
                Portal access stores login credentials and the Bitcoin balance assigned by your advisor.
                This data is not publicly accessible.
              </p>
              <h2>Your rights</h2>
              <p>You may request access, correction, or deletion of your personal data.</p>
            </>
          )}
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
