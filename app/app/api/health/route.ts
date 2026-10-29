import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      app: "roamy",
      paymentMock: env.PAYMENT_MOCK,
      aiMock: env.AI_MOCK,
      emailMock: !env.RESEND_API_KEY,
      time: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }
}
