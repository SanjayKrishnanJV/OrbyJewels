import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const banner = await db.banner.update({
    where: { id },
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image || null,
      link: body.link || null,
      isActive: body.isActive,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(banner);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
