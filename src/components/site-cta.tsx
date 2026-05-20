import { Link } from "@/i18n/routing";
import { siteContact } from "@/lib/site-config";

export function SiteCta({
  title,
  subtitle,
  locale,
}: {
  title: string;
  subtitle: string;
  locale: string;
}) {
  const de = locale === "de";

  return (
    <section className="bg-brand-teal py-16 text-white md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-50">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#form"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-brand-tealDark shadow-soft transition hover:bg-brand-tealLight"
          >
            {de ? "Kostenlose Beratung" : "Free consultation"}
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-white/80 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            {de ? "Kontakt" : "Contact"}
          </Link>
        </div>
        <p className="mt-10 text-sm text-teal-100">{siteContact.representative}</p>
      </div>
    </section>
  );
}
