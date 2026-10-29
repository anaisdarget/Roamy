import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/guard";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.tripRequest.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true, deleted: id });
}
