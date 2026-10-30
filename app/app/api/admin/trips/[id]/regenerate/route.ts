import { after, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/guard";
import { resetForRegeneration, runGenerationJob } from "@/lib/jobs/generation";

export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  await resetForRegeneration(id);
  after(() => runGenerationJob(id));
  return NextResponse.json({ ok: true, message: "Régénération lancée." });
}