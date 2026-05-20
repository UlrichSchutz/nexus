import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="footer-bg" id="contact">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-display font-bold text-white">
              NT
            </div>
            <span className="font-serif text-xl font-bold text-white">
              Nexus <span className="text-brand-tealLight">Tech</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-100">
            <Link href="/#about" className="transition hover:text-white">
              {nav("procedure")}
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              {nav("contact")}
            </Link>
            <Link href="/#form" className="transition hover:text-white">
              {t("consultation")}
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
            © {year} Nexus Tech CH, Bern · {t("rights")}
          </p>
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-teal-200/80">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
