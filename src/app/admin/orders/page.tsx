export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin | Orby Jewels" };

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-50 text-gray-600",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      address: { select: { city: true, state: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => ["CONFIRMED", "PROCESSING"].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Orders</h1>
        <p className="text-nude-500 mt-1">{stats.total} total orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-chocolate-950" },
          { label: "Pending", value: stats.pending, color: "text-yellow-700" },
          { label: "Processing", value: stats.processing, color: "text-blue-700" },
          { label: "Shipped", value: stats.shipped, color: "text-indigo-700" },
          { label: "Delivered", value: stats.delivered, color: "text-green-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 border border-nude-100 text-center">
            <p className={`font-playfair text-3xl ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-nude-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-nude-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-champagne-100 border-b border-nude-200">
              <tr>
                {["Order #", "Customer", "Items", "Location", "Total", "Payment", "Status", "Date", "Action"].map((h) => (
                  <th key={h} className="px-4 py-4 text-left text-xs font-semibold text-nude-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-champagne-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-xs font-mono text-gold-dark">{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-chocolate-950">{order.user.name}</p>
                    <p className="text-[10px] text-nude-400">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-nude-600">{order.items.length}</td>
                  <td className="px-4 py-4 text-xs text-nude-600">
                    {order.address.city}, {order.address.state}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-chocolate-950">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${PAYMENT_COLORS[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-nude-500 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-gold-dark hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16">
              <p className="text-nude-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
