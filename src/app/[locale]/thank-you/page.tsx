import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thankYou");

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-brand-canvas px-4 py-24">
      <div className="glass-panel max-w-lg rounded-2xl border-brand-teal/20 p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tealLight text-3xl text-brand-teal">
          ✓
        </div>
        <h1 className="page-title text-3xl">{t("title")}</h1>
        <p className="mb-8 mt-4 text-brand-muted">{t("subtitle")}</p>
        <Link href="/" className="btn-cyber inline-block">
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
