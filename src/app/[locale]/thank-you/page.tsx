import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thankYou");

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="glass-panel max-w-lg rounded-2xl p-12 text-center">
        <h1 className="mb-4 font-tech text-4xl font-bold text-white">{t("title")}</h1>
        <p className="mb-8 text-gray-400">{t("subtitle")}</p>
        <Link href="/" className="btn-cyber inline-block">
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
