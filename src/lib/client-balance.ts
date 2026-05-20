import { fetchMarketSnapshot, resolveDisplayEur } from "@/lib/exchange";
import { prisma } from "@/lib/db";

/** Withdrawable EUR balance (admin-set EUR or BTC × live rate). */
export async function getClientAvailableEur(userId: string): Promise<number> {
  const [balance, markets] = await Promise.all([
    prisma.clientBalance.findUnique({ where: { userId } }),
    fetchMarketSnapshot(),
  ]);

  const btc = balance ? Number(balance.btcAmount ?? 0) : 0;
  const adminEur = balance ? Number(balance.eurAmount ?? 0) : 0;
  const { displayEur } = resolveDisplayEur(
    Number.isFinite(adminEur) ? adminEur : 0,
    Number.isFinite(btc) ? btc : 0,
    markets.btcEur
  );
  return Number.isFinite(displayEur) ? displayEur : 0;
}
