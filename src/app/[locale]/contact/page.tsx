import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { ContactDetails } from "@/components/contact-details";
import { PageHero } from "@/components/page-hero";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section className="page-shell">
      <div className="container mx-auto px-4">
        <PageHero title={t("title")} subtitle={t("subtitle")} />
        <ContactDetails locale={locale} />
        <div id="contact-form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
