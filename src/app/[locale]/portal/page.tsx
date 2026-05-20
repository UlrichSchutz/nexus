import { getServerSession } from "next-auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PortalDashboard } from "@/components/portal-dashboard";

type Props = { params: Promise<{ locale: string }> };

const PORTAL_KEYS = [
  "title", "welcome", "logout", "loading", "eurBalance", "btcBalance", "lastUpdated",
  "liveEstimate", "systemNotice", "bankTitle", "recipientName", "iban", "bic",
  "bankSave", "bankUpdate", "bankSaved", "bankError", "bankRequired",
  "withdrawTitle", "withdrawAmount", "withdrawNote", "withdrawSubmit", "withdrawSent",
  "withdrawError", "insufficientBalance", "pendingExists", "withdrawHistory",
  "statusPending", "statusApproved", "statusRejected", "statusCompleted",
  "secureArea", "backHome", "eurFromMarket", "eurFromAdmin", "valuationBreakdown",
  "quickStats", "openRequests", "bankLinked", "marketOverview", "liveMarkets",
  "updated", "marketsLoading", "forex", "bankDesc", "withdrawDesc", "maxWithdraw",
  "supportTitle", "supportDesc", "phone", "hours", "supportHours", "contactForm",
  "securityTips", "tip1", "tip2", "tip3",
] as const;

export default async function PortalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations("portal");

  if (!session?.user?.id) redirect(`/${locale}/portal/login`);
  if (session.user.role === "ADMIN") redirect(`/${locale}/admin`);

  const labels = Object.fromEntries(
    PORTAL_KEYS.map((key) => [key, t(key)])
  ) as Record<string, string>;

  return (
    <PortalDashboard
      userName={session.user.name ?? session.user.email ?? ""}
      locale={locale}
      labels={labels}
    />
  );
}
