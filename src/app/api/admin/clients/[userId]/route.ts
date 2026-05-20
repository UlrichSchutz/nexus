import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

type Params = { params: Promise<{ userId: string }> };

const patchSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  phone: z.string().max(30).optional().nullable(),
  active: z.boolean().optional(),
  newPassword: z.string().min(8).max(128).optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { userId } = await params;
    const body = patchSchema.parse(await request.json());

    const existing = await prisma.user.findFirst({
      where: { id: userId, role: Role.CLIENT },
    });
    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (body.email && body.email.toLowerCase() !== existing.email) {
      const taken = await prisma.user.findUnique({
        where: { email: body.email.toLowerCase() },
      });
      if (taken) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    const data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      active?: boolean;
      passwordHash?: string;
    } = {};

    if (body.email) data.email = body.email.toLowerCase();
    if (body.firstName !== undefined) data.firstName = body.firstName.trim();
    if (body.lastName !== undefined) data.lastName = body.lastName.trim();
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
    if (body.active !== undefined) data.active = body.active;
    if (body.newPassword) data.passwordHash = await bcrypt.hash(body.newPassword, 12);

    const client = await prisma.user.update({
      where: { id: userId },
      data,
      include: { balance: true, bankAccount: true },
    });

    return NextResponse.json({
      client,
      passwordUpdated: Boolean(body.newPassword),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
