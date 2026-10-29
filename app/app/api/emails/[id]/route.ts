import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!env.AI_MOCK) {
    return new Response("Aperçu indisponible.", { status: 404 });
  }

  const { id } = await params;
  const log = await prisma.emailLog.findUnique({
    where: { id },
    select: { previewHtml: true },
  });

  if (!log?.previewHtml) {
    return new Response("Aperçu introuvable.", { status: 404 });
  }

  return new Response(log.previewHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
