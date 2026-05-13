import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const where = session.user?.role === "ADMIN"
      ? {}
      : { userId: session.user?.id };

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, addressId, couponCode, paymentMethod = "UPI" } = body;

    if (!items || items.length === 0 || !addressId) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Verify address belongs to user
    const address = await db.address.findFirst({
      where: { id: addressId, userId: session.user!.id },
    });
    if (!address) return NextResponse.json({ error: "Invalid address" }, { status: 400 });

    // Fetch product prices from DB (don't trust client)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const total = product.price * item.quantity;
      subtotal += total;
      return { productId: item.productId, quantity: item.quantity, price: product.price, total };
    });

    // Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findFirst({
        where: { code: couponCode, isActive: true },
      });
      if (coupon) {
        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }
        await db.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const shipping = subtotal > 5000 ? 0 : 99;
    const taxRate = 0.03;
    const tax = Math.round((subtotal - discount) * taxRate);
    const total = subtotal - discount + shipping + tax;

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user!.id,
        addressId,
        paymentMethod: paymentMethod as "UPI" | "COD" | "RAZORPAY" | "STRIPE",
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponCode,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
