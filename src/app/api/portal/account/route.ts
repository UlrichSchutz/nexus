import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/client-session";
import { fetchMarketSnapshot, resolveDisplayEur } from "@/lib/exchange";

export async function GET() {
  try {
    const session = await requireClient();
    const [balance, markets] = await Promise.all([
      prisma.clientBalance.findUnique({ where: { userId: session.user.id } }),
      fetchMarketSnapshot(),
    ]);

    const btc = balance ? Number(balance.btcAmount ?? 0) : 0;
    const adminEur = balance ? Number(balance.eurAmount ?? 0) : 0;
    const safeBtc = Number.isFinite(btc) ? btc : 0;
    const safeAdminEur = Number.isFinite(adminEur) ? adminEur : 0;

    const { displayEur, eurSource, liveEur } = resolveDisplayEur(
      safeAdminEur,
      safeBtc,
      markets.btcEur
    );

    const btcAsset = markets.crypto.find((c) => c.id === "bitcoin");

    return NextResponse.json({
      btcAmount: safeBtc,
      eurAmount: safeAdminEur,
      displayEur,
      eurSource,
      liveEurEstimate: liveEur,
      btcPriceEur: markets.btcEur,
      btcChange24h: btcAsset?.change24h ?? null,
      systemNotice: balance?.systemNotice ?? null,
      updatedAt: balance?.updatedAt?.toISOString() ?? null,
      rates: {
        btcEur: markets.btcEur,
        liveEurEstimate: liveEur,
        fetchedAt: markets.fetchedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
