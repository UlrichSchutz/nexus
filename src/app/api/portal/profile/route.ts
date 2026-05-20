import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/client-session";

export async function GET() {
  try {
    const session = await requireClient();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ profile: user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const patchSchema = z.object({
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  phone: z.string().max(30).optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await requireClient();
    const body = patchSchema.parse(await request.json());

    const profile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.firstName !== undefined && { firstName: body.firstName.trim() }),
        ...(body.lastName !== undefined && { lastName: body.lastName.trim() }),
        ...(body.phone !== undefined && { phone: body.phone.trim() || null }),
      },
      select: { email: true, firstName: true, lastName: true, phone: true },
    });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
