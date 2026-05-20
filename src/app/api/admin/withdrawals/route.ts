import { NextResponse } from "next/server";
import { z } from "zod";
import { WithdrawalStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    const requests = await prisma.withdrawalRequest.findMany({
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        bankAccount: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]),
  adminNote: z.string().max(500).optional(),
});

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = patchSchema.parse(await request.json());

    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id: body.id },
      data: {
        status: body.status as WithdrawalStatus,
        adminNote: body.adminNote,
      },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        bankAccount: true,
      },
    });

    return NextResponse.json({ withdrawal });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}
