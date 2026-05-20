import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl space-y-6 px-4 text-gray-300">
        <h1 className="font-tech text-4xl font-bold text-white">
          {de ? "Datenschutzerklärung" : "Privacy policy"}
        </h1>
        {de ? (
          <>
            <p>
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre
              Daten vertraulich gemäss Schweizer DSG und der EU-DSGVO.
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Erhebung von Daten</h2>
            <p>
              Personenbezogene Daten werden nur erhoben, wenn Sie uns diese im Rahmen einer Kontakt-
              oder Fallanfrage freiwillig mitteilen (Name, E-Mail, Telefon, Nachricht).
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Kundenportal</h2>
            <p>
              Für den Zugang zum Kundenportal speichern wir Login-Daten und den von Ihrem Berater
              freigegebenen Bitcoin-Saldo. Diese Daten sind nicht öffentlich zugänglich.
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten.
            </p>
          </>
        ) : (
          <>
            <p>
              We treat your personal data confidentially in accordance with Swiss FADP and the EU GDPR.
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Data collection</h2>
            <p>
              We only collect personal data you voluntarily submit via contact or case forms (name, email,
              phone, message).
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Client portal</h2>
            <p>
              Portal access stores login credentials and the Bitcoin balance assigned by your advisor.
              This data is not publicly accessible.
            </p>
            <h2 className="font-tech text-xl text-cyber-cyan">Your rights</h2>
            <p>You may request access, correction, or deletion of your personal data.</p>
          </>
        )}
        <p className="pt-8 text-sm">
          <Link href="/" className="text-cyber-cyan hover:underline">
            ← {de ? "Startseite" : "Home"}
          </Link>
        </p>
      </div>
    </section>
  );
}
