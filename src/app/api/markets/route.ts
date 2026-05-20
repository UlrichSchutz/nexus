import { NextResponse } from "next/server";
import { fetchMarketSnapshot } from "@/lib/exchange";

export async function GET() {
  const snapshot = await fetchMarketSnapshot();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
