import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { utr } = await req.json();

  const order = await db.order.findFirst({ where: { id, userId: session.user!.id } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const note = utr ? `UTR: ${utr}` : "Payment submitted by customer";

  await db.order.update({
    where: { id },
    data: { notes: order.notes ? `${order.notes} | ${note}` : note },
  });

  return NextResponse.json({ success: true });
}
