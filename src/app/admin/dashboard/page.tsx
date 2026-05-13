export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard — Orby Jewels" };

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRevenue, monthRevenue, lastMonthRevenue,
    totalOrders, monthOrders,
    totalCustomers, monthCustomers,
    totalProducts,
    recentOrders, lowStock,
  ] = await Promise.all([
    db.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    db.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    db.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, _sum: { total: true } }),
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } } }),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } }, items: true },
    }),
    db.product.findMany({
      where: { stock: { lte: 5 }, status: "ACTIVE" },
      take: 5,
    }),
  ]);

  const revenueGrowth = lastMonthRevenue._sum.total && lastMonthRevenue._sum.total > 0
    ? Math.round((((monthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100)
    : 0;

  return {
    revenue: { total: totalRevenue._sum.total || 0, month: monthRevenue._sum.total || 0, growth: revenueGrowth },
    orders: { total: totalOrders, month: monthOrders },
    customers: { total: totalCustomers, month: monthCustomers },
    products: { total: totalProducts },
    recentOrders,
    lowStock,
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue.total),
      sub: `${formatPrice(stats.revenue.month)} this month`,
      icon: TrendingUp,
      growth: stats.revenue.growth,
      color: "text-green-600",
    },
    {
      label: "Total Orders",
      value: stats.orders.total.toString(),
      sub: `${stats.orders.month} this month`,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      label: "Customers",
      value: stats.customers.total.toString(),
      sub: `${stats.customers.month} new this month`,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Active Products",
      value: stats.products.total.toString(),
      sub: "Currently listed",
      icon: Package,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">
          Welcome, {session?.user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-nude-500 mt-1">Here&apos;s what&apos;s happening at Orby Jewels today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-nude-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-champagne-100 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              {stat.growth !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.growth >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {stat.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(stat.growth)}%
                </div>
              )}
            </div>
            <p className="font-playfair text-2xl text-chocolate-950 mb-1">{stat.value}</p>
            <p className="text-xs text-nude-500">{stat.label}</p>
            <p className="text-xs text-nude-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-nude-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-nude-100">
            <h2 className="font-semibold text-chocolate-950">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-gold-dark hover:text-gold-600 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-champagne-100">
                <tr>
                  {["Order", "Customer", "Items", "Total", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-nude-50">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-champagne-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-gold-dark hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-chocolate-800">{order.user.name}</td>
                    <td className="px-4 py-3 text-xs text-nude-500">{order.items.length} items</td>
                    <td className="px-4 py-3 text-xs font-medium text-chocolate-950">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.recentOrders.length === 0 && (
              <p className="text-center text-nude-400 py-8 text-sm">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick actions + Low stock */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add New Product", href: "/admin/products/new", color: "bg-chocolate-950 text-champagne-100" },
                { label: "View All Orders", href: "/admin/orders", color: "bg-gold-500 text-chocolate-950" },
                { label: "Manage Categories", href: "/admin/categories", color: "border border-nude-200 text-chocolate-800" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`block w-full px-4 py-3 text-sm font-medium text-center rounded-sm ${action.color} hover:opacity-90 transition-opacity`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          {stats.lowStock.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
              <h2 className="font-semibold text-chocolate-950 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Low Stock Alert
              </h2>
              <div className="space-y-3">
                {stats.lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <Link href={`/admin/products/${product.id}`} className="text-xs text-chocolate-800 hover:text-gold-dark transition-colors truncate max-w-[150px]">
                      {product.name}
                    </Link>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
