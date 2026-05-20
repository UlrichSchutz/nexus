import { getServerSession } from "next-auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminBackoffice } from "@/components/admin-backoffice";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations("admin");
  const nav = await getTranslations("nav");

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect(`/${locale}/portal/login?callbackUrl=/${locale}/admin`);
  }

  return (
    <AdminBackoffice
      locale={locale}
      labels={{
        title: t("title"),
        clients: t("clients"),
        createClient: t("createClient"),
        btcBalance: t("btcBalance"),
        eurBalance: t("eurBalance"),
        systemNotice: t("systemNotice"),
        save: t("save"),
        note: t("note"),
        email: t("email"),
        password: t("password"),
        firstName: t("firstName"),
        lastName: t("lastName"),
        phone: t("phone"),
        actions: t("actions"),
        clientPortal: nav("clientPortal"),
        withdrawals: t("withdrawals"),
        noWithdrawals: t("noWithdrawals"),
        approve: t("approve"),
        reject: t("reject"),
        complete: t("complete"),
        recipientName: t("recipientName"),
        clientNote: t("clientNote"),
      }}
    />
  );
}
