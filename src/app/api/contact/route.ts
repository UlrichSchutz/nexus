import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  message: z.string().min(10),
  locale: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.company) return NextResponse.json({ ok: true });

    const data = schema.parse(body);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? null;

    await prisma.contactSubmission.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        message: data.message,
        locale: data.locale ?? "de",
        ip,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}
