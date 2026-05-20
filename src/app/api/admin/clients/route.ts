import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    const clients = await prisma.user.findMany({
      where: { role: Role.CLIENT },
      include: { balance: true, bankAccount: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ clients });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  btcAmount: z.number().min(0).default(0),
  eurAmount: z.number().min(0).default(0),
  systemNotice: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = createSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        role: Role.CLIENT,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        balance: {
          create: {
            btcAmount: body.btcAmount,
            eurAmount: body.eurAmount,
            systemNotice: body.systemNotice,
            note: body.note,
            updatedBy: session.user.email ?? session.user.id,
          },
        },
      },
      include: { balance: true },
    });

    await prisma.balanceAuditLog.create({
      data: {
        clientUserId: user.id,
        adminId: session.user.id,
        previousBtc: 0,
        newBtc: body.btcAmount,
        note: body.note ?? "Initial balance",
      },
    });

    return NextResponse.json({ client: user });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}
