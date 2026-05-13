import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Sync subcategories: delete existing and recreate
  await db.subcategory.deleteMany({ where: { categoryId: id } });

  const category = await db.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      image: body.image || null,
      isActive: body.isActive,
      sortOrder: body.sortOrder ?? 0,
      subcategories: {
        create: (body.subcategories || []).map((s: { name: string; slug: string }) => ({
          name: s.name,
          slug: s.slug,
        })),
      },
    },
    include: { subcategories: true },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
