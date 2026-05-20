import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(30),
  locale: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const data = schema.parse(body);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    let country: string | null = null;
    try {
      const geo = await fetch(`https://ip-api.com/json/${ip}?fields=country`, {
        signal: AbortSignal.timeout(3000),
      });
      const json = await geo.json();
      country = json.country ?? null;
    } catch {
      /* optional */
    }

    await prisma.leadSubmission.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        locale: data.locale ?? "de",
        country,
        ip,
        userAgent: request.headers.get("user-agent"),
      },
    });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const text = encodeURIComponent(
        `🔥 NEW LEAD\n\n${data.firstName} ${data.lastName}\n${data.email}\n${data.phone}\n${country ?? "?"}\n${ip}`
      );
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`,
        { signal: AbortSignal.timeout(5000) }
      ).catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
