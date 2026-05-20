import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  userId: z.string(),
  btcAmount: z.number().min(0),
  eurAmount: z.number().min(0).optional(),
  systemNotice: z.string().max(2000).nullable().optional(),
  note: z.string().optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = schema.parse(await request.json());

    const existing = await prisma.clientBalance.findUnique({
      where: { userId: body.userId },
    });

    const previous = existing ? Number(existing.btcAmount) : 0;

    const balance = await prisma.clientBalance.upsert({
      where: { userId: body.userId },
      update: {
        btcAmount: body.btcAmount,
        eurAmount: body.eurAmount ?? existing?.eurAmount ?? 0,
        systemNotice: body.systemNotice !== undefined ? body.systemNotice : existing?.systemNotice,
        note: body.note,
        updatedBy: session.user.email ?? session.user.id,
      },
      create: {
        userId: body.userId,
        btcAmount: body.btcAmount,
        eurAmount: body.eurAmount ?? 0,
        systemNotice: body.systemNotice ?? null,
        note: body.note,
        updatedBy: session.user.email ?? session.user.id,
      },
    });

    await prisma.balanceAuditLog.create({
      data: {
        clientUserId: body.userId,
        adminId: session.user.id,
        previousBtc: previous,
        newBtc: body.btcAmount,
        note: body.note,
      },
    });

    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}
