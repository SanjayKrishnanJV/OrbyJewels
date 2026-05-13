import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: session.user!.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user!.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: { userId: session.user!.id, name, phone, line1, line2, city, state, pincode, isDefault: isDefault || false },
    });

    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
