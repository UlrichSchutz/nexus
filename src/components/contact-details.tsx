import { siteContact } from "@/lib/site-config";

export function ContactDetails({ locale }: { locale: string }) {
  const de = locale === "de";

  return (
    <div className="glass-panel mx-auto mb-10 max-w-xl rounded-2xl p-6 text-center text-sm">
      <p className="font-serif text-lg font-bold text-brand-ink">{siteContact.representative}</p>
      <p className="text-brand-muted">
        {de ? siteContact.representativeRole.de : siteContact.representativeRole.en} · {siteContact.companyName}
      </p>
      <div className="mt-4 space-y-2 text-brand-muted">
        <p>
          <a href={`tel:${siteContact.phoneTel}`} className="font-medium text-brand-teal hover:underline">
            {siteContact.phone}
          </a>
        </p>
        <p>
          <a href={`mailto:${siteContact.email}`} className="font-medium text-brand-teal hover:underline">
            {siteContact.email}
          </a>
        </p>
      </div>
    </div>
  );
}
