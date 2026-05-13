export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { User, Package, MapPin, Heart } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { orders: true } },
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) redirect("/login");

  const totalSpent = await db.order.aggregate({
    where: { userId: user.id, paymentStatus: "PAID" },
    _sum: { total: true },
  });

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="mb-10">
          <h1 className="font-playfair text-4xl text-chocolate-950">My Account</h1>
          <p className="text-nude-500 mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Total Orders", value: user._count.orders, icon: Package },
            { label: "Total Spent", value: formatPrice(totalSpent._sum.total || 0), icon: Package },
            { label: "Member Since", value: formatDate(user.createdAt), icon: User },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-champagne-100 flex items-center justify-center">
                <stat.icon size={20} className="text-gold-dark" />
              </div>
              <div>
                <p className="font-playfair text-xl text-chocolate-950">{stat.value}</p>
                <p className="text-xs text-nude-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="bg-white p-6">
            <h2 className="font-playfair text-xl text-chocolate-950 mb-5">Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-nude-400 uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm text-chocolate-950 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-nude-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-chocolate-950">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-xs text-nude-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-chocolate-950">{user.phone}</p>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-2">
              <Link href="/account/addresses" className="flex items-center gap-2 text-sm text-gold-dark hover:text-gold-600 transition-colors">
                <MapPin size={14} />
                Manage Addresses
              </Link>
              <Link href="/wishlist" className="flex items-center gap-2 text-sm text-gold-dark hover:text-gold-600 transition-colors">
                <Heart size={14} />
                My Wishlist
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-xl text-chocolate-950">Recent Orders</h2>
              <Link href="/orders" className="text-xs text-gold-dark hover:underline">View All →</Link>
            </div>
            {user.orders.length === 0 ? (
              <div className="text-center py-10">
                <Package size={40} className="text-nude-300 mx-auto mb-3" />
                <p className="text-nude-400">No orders yet</p>
                <Link href="/products" className="text-gold-dark text-sm mt-2 inline-block hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-champagne-50 transition-colors border border-nude-100 rounded-sm">
                    <div>
                      <p className="text-sm font-mono text-chocolate-950">{order.orderNumber}</p>
                      <p className="text-xs text-nude-500 mt-0.5">{order.items.length} items • {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-chocolate-950">{formatPrice(order.total)}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
