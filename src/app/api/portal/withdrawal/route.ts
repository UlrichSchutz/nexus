import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/client-session";
import { getClientAvailableEur } from "@/lib/client-balance";
import { Prisma } from "@prisma/client";
import { sendTelegramAlert } from "@/lib/telegram";

const schema = z.object({
  eurAmount: z.coerce.number().positive().max(50_000_000),
  clientNote: z.string().max(500).optional(),
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function GET() {
  try {
    const session = await requireClient();
    const requests = await prisma.withdrawalRequest.findMany({
      where: { userId: session.user.id },
      include: { bankAccount: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({
      requests: requests.map((r) => ({
        ...r,
        eurAmount: String(
          (r as { eurAmount?: unknown; btcAmount?: unknown }).eurAmount ??
            (r as { btcAmount?: unknown }).btcAmount ??
            0
        ),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireClient();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { active: true },
    });
    if (!user?.active) {
      return NextResponse.json({ error: "Account inactive" }, { status: 403 });
    }

    const body = schema.parse(await request.json());
    const amount = round2(body.eurAmount);

    const bank = await prisma.bankAccount.findUnique({
      where: { userId: session.user.id },
    });
    if (!bank) {
      return NextResponse.json({ error: "Bank account required" }, { status: 400 });
    }

    const available = round2(await getClientAvailableEur(session.user.id));
    if (amount > available + 0.01) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const pending = await prisma.withdrawalRequest.count({
      where: { userId: session.user.id, status: "PENDING" },
    });
    if (pending > 0) {
      return NextResponse.json({ error: "Pending request exists" }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: session.user.id,
        bankAccountId: bank.id,
        eurAmount: new Prisma.Decimal(amount.toFixed(2)),
        clientNote: body.clientNote,
      },
      include: { bankAccount: true },
    });

    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, firstName: true, lastName: true },
    });

    void sendTelegramAlert(
      [
        "💸 EUR WITHDRAWAL REQUEST",
        "",
        u
          ? `Client: ${[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email}`
          : "Client: (unknown)",
        u ? `📧 ${u.email}` : null,
        `💶 ${amount.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`,
        `🏦 ${withdrawal.bankAccount.recipientName}`,
        `IBAN: ${withdrawal.bankAccount.iban}`,
        `BIC: ${withdrawal.bankAccount.bic}`,
        body.clientNote ? `\nNote: ${body.clientNote}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );

    return NextResponse.json({ withdrawal });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const detail = String(e);
    console.error("Withdrawal POST error:", e);
    if (detail.includes("eurAmount") || detail.includes("btcAmount") || detail.includes("column")) {
      return NextResponse.json({ error: "Database migration required" }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
