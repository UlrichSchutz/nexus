import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="mb-4 text-center font-tech text-4xl font-bold text-white">{t("title")}</h1>
        <p className="mb-12 text-center text-gray-400">{t("subtitle")}</p>
        <ContactForm />
      </div>
    </section>
  );
}
