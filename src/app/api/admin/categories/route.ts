import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const existing = await db.category.findUnique({ where: { slug: body.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 400 });

  const category = await db.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      image: body.image || null,
      isActive: body.isActive ?? true,
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
  return NextResponse.json(category, { status: 201 });
}
