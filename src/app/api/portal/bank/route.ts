import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/client-session";
import { isValidBic, isValidIban, normalizeBic, normalizeIban } from "@/lib/bank";
import { sendTelegramAlert } from "@/lib/telegram";

export async function GET() {
  try {
    const session = await requireClient();
    const bank = await prisma.bankAccount.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ bank });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const bankSchema = z.object({
  recipientName: z.string().min(2).max(120),
  iban: z.string().min(15).max(42),
  bic: z.string().min(8).max(11),
});

export async function POST(request: Request) {
  try {
    const session = await requireClient();
    const body = bankSchema.parse(await request.json());

    const iban = normalizeIban(body.iban);
    const bic = normalizeBic(body.bic);

    if (!isValidIban(iban) || !isValidBic(bic)) {
      return NextResponse.json({ error: "Invalid IBAN or BIC" }, { status: 400 });
    }

    const existing = await prisma.bankAccount.findUnique({
      where: { userId: session.user.id },
    });

    const bank = await prisma.bankAccount.upsert({
      where: { userId: session.user.id },
      update: {
        recipientName: body.recipientName.trim(),
        iban,
        bic,
      },
      create: {
        userId: session.user.id,
        recipientName: body.recipientName.trim(),
        iban,
        bic,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, firstName: true, lastName: true },
    });

    await sendTelegramAlert(
      [
        existing ? "🏦 BANK DETAILS UPDATED" : "🏦 NEW BANK DETAILS",
        "",
        user
          ? `Client: ${[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}`
          : null,
        user ? `📧 ${user.email}` : null,
        `Empfänger: ${bank.recipientName}`,
        `IBAN: ${bank.iban}`,
        `BIC: ${bank.bic}`,
      ]
        .filter(Boolean)
        .join("\n")
    );

    return NextResponse.json({ bank });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
