import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

// Razorpay order creation
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId } = await req.json();

    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user!.id },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Create Razorpay order via API
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKey || !razorpaySecret) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const auth64 = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString("base64");

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth64}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(order.total * 100), // in paise
        currency: "INR",
        receipt: order.orderNumber,
        notes: { orderId: order.id },
      }),
    });

    const rzpOrder = await rzpResponse.json();

    if (!rzpResponse.ok) {
      return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
    }

    await db.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        provider: "RAZORPAY",
        providerOrderId: rzpOrder.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Razorpay payment verification
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await db.$transaction([
      db.payment.updateMany({
        where: { orderId },
        data: {
          status: "PAID",
          providerPaymentId: razorpay_payment_id,
          providerSignature: razorpay_signature,
        },
      }),
      db.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RAZORPAY_VERIFY]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
