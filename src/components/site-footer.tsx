import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="footer-bg relative border-t border-cyber-border" id="contact">
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 font-tech font-bold text-cyber-cyan">
              NT
            </div>
            <span className="font-tech text-xl font-bold uppercase tracking-widest text-white">
              Nexus <span className="text-cyber-cyan">Tech</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-tech text-sm text-gray-400">
            <Link href="/#about" className="transition hover:text-cyber-cyan">
              {nav("procedure")}
            </Link>
            <Link href="/contact" className="transition hover:text-cyber-cyan">
              {nav("contact")}
            </Link>
            <Link href="/#form" className="transition hover:text-cyber-cyan">
              {t("consultation")}
            </Link>
            <Link href="/impressum" className="transition hover:text-cyber-cyan">
              {t("impressum")}
            </Link>
            <Link href="/datenschutz" className="transition hover:text-cyber-cyan">
              {t("privacy")}
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="mb-3 text-xs text-gray-500">
            © {year} Nexus Tech CH, Bern · {t("rights")}
          </p>
          <p className="mx-auto max-w-3xl text-[10px] leading-relaxed text-gray-600">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
