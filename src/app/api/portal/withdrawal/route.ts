import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/client-session";

const schema = z.object({
  btcAmount: z.number().positive(),
  clientNote: z.string().max(500).optional(),
});

export async function GET() {
  try {
    const session = await requireClient();
    const requests = await prisma.withdrawalRequest.findMany({
      where: { userId: session.user.id },
      include: { bankAccount: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireClient();
    const body = schema.parse(await request.json());

    const bank = await prisma.bankAccount.findUnique({
      where: { userId: session.user.id },
    });
    if (!bank) {
      return NextResponse.json({ error: "Bank account required" }, { status: 400 });
    }

    const balance = await prisma.clientBalance.findUnique({
      where: { userId: session.user.id },
    });
    const available = balance ? Number(balance.btcAmount) : 0;
    if (body.btcAmount > available) {
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
        btcAmount: body.btcAmount,
        clientNote: body.clientNote,
      },
      include: { bankAccount: true },
    });

    return NextResponse.json({ withdrawal });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
