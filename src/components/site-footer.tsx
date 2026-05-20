import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { siteContact } from "@/lib/site-config";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="footer-bg" id="contact">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-serif font-bold text-white">
                NT
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Nexus <span className="text-brand-tealLight">Tech</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-teal-100">
              {siteContact.tagline}
              <br />
              {siteContact.location}
            </p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">{siteContact.representative}</p>
            <p className="text-sm text-teal-100">
              <a href={`tel:${siteContact.phoneTel}`} className="block transition hover:text-white">
                {siteContact.phone}
              </a>
              <a href={`mailto:${siteContact.email}`} className="mt-2 block transition hover:text-white">
                {siteContact.email}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-teal-100 md:justify-end">
            <Link href="/#about" className="transition hover:text-white">
              {nav("procedure")}
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              {nav("contact")}
            </Link>
            <Link href="/#form" className="transition hover:text-white">
              {t("consultation")}
            </Link>
            <Link href="/portal" className="transition hover:text-white">
              {nav("clientPortal")}
            </Link>
            <Link href="/impressum" className="transition hover:text-white">
              {t("impressum")}
            </Link>
            <Link href="/datenschutz" className="transition hover:text-white">
              {t("privacy")}
            </Link>
          </div>
        </div>
        <div className="border-t border-white/15 pt-8 text-center">
          <p className="mb-3 text-sm text-teal-100">
            © {year} {siteContact.companyName} · {t("rights")}
          </p>
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-teal-200/80">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
