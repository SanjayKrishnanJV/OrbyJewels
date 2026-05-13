import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      totalCustomers,
      monthCustomers,
      totalProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      db.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      db.order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      db.order.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
        _sum: { total: true },
      }),
      db.order.count(),
      db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } } }),
      db.product.count({ where: { status: "ACTIVE" } }),
      db.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
      db.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
    ]);

    const topProductIds = topProducts.map((p) => p.productId);
    const topProductDetails = await db.product.findMany({
      where: { id: { in: topProductIds } },
      include: { images: { take: 1 } },
    });

    const revenueGrowth =
      lastMonthRevenue._sum.total && lastMonthRevenue._sum.total > 0
        ? (((monthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) /
            lastMonthRevenue._sum.total) * 100
        : 0;

    return NextResponse.json({
      revenue: {
        total: totalRevenue._sum.total || 0,
        month: monthRevenue._sum.total || 0,
        growth: Math.round(revenueGrowth),
      },
      orders: {
        total: totalOrders,
        month: monthOrders,
      },
      customers: {
        total: totalCustomers,
        month: monthCustomers,
      },
      products: { total: totalProducts },
      recentOrders,
      topProducts: topProducts.map((tp) => ({
        ...tp,
        product: topProductDetails.find((p) => p.id === tp.productId),
      })),
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
