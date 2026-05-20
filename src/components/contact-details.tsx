import { Link } from "@/i18n/routing";
import { siteContact } from "@/lib/site-config";

export function ContactDetails({ locale }: { locale: string }) {
  const de = locale === "de";

  return (
    <div className="glass-panel mx-auto mb-10 max-w-xl rounded-2xl p-6 text-center text-sm">
      <p className="font-serif text-lg font-bold text-brand-ink">{siteContact.representative}</p>
      <p className="text-brand-muted">
        {de ? siteContact.representativeRole.de : siteContact.representativeRole.en} · {siteContact.companyName}
      </p>
      <p className="mt-4 text-brand-muted">
        {de
          ? "Nutzen Sie das Formular unten — wir melden uns zeitnah bei Ihnen."
          : "Please use the form below — we will get back to you shortly."}
      </p>
      <Link href="/contact#contact-form" className="btn-outline mt-4 inline-block text-sm">
        {de ? "Zum Kontaktformular" : "Go to contact form"}
      </Link>
    </div>
  );
}
