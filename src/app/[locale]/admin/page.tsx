import { getServerSession } from "next-auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminBackoffice } from "@/components/admin-backoffice";

type Props = { params: Promise<{ locale: string }> };

const ADMIN_KEYS = [
  "title", "clients", "createClient", "btcBalance", "eurBalance", "systemNotice",
  "save", "note", "email", "password", "firstName", "lastName", "phone", "actions",
  "withdrawals", "noWithdrawals", "approve", "reject", "complete", "recipientName", "clientNote",
  "totalClients", "activeClients", "pendingWithdrawals", "profileSection", "passwordSection",
  "passwordStored", "newPasswordPlaceholder", "resetPassword", "saveProfile", "saveBalance",
  "profileSaved", "balanceSaved", "passwordReset", "passwordCopyHint", "passwordTooShort",
  "saveError", "dismiss", "show", "hide", "memberSince", "active",
] as const;

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations("admin");
  const nav = await getTranslations("nav");

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect(`/${locale}/portal/login?callbackUrl=/${locale}/admin`);
  }

  const labels = {
    ...Object.fromEntries(ADMIN_KEYS.map((key) => [key, t(key)])),
    clientPortal: nav("clientPortal"),
  } as Record<string, string>;

  return <AdminBackoffice locale={locale} labels={labels} />;
}
