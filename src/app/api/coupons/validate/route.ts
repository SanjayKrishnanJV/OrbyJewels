import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, orderValue } = await req.json();

    const coupon = await db.coupon.findFirst({
      where: {
        code: { equals: code, mode: "insensitive" },
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    // If no coupon found with expiry, try without expiry constraint
    const validCoupon = coupon || await db.coupon.findFirst({
      where: {
        code: { equals: code, mode: "insensitive" },
        isActive: true,
        expiresAt: null,
      },
    });

    if (!validCoupon) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
    }

    if (validCoupon.minOrderValue && orderValue < validCoupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value ₹${validCoupon.minOrderValue} required` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (validCoupon.discountType === "PERCENTAGE") {
      discount = (orderValue * validCoupon.discountValue) / 100;
      if (validCoupon.maxDiscount) discount = Math.min(discount, validCoupon.maxDiscount);
    } else {
      discount = validCoupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount),
      coupon: {
        code: validCoupon.code,
        discountType: validCoupon.discountType,
        discountValue: validCoupon.discountValue,
        description: validCoupon.description,
      },
    });
  } catch (error) {
    console.error("[COUPON_VALIDATE]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
