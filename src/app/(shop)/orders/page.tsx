export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/orders");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
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
        <h1 className="font-playfair text-4xl text-chocolate-950 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={48} className="text-nude-300 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl text-chocolate-800 mb-3">No orders yet</h2>
            <p className="text-nude-400 mb-8">Discover our beautiful jewellery collection</p>
            <Link href="/products" className="inline-flex px-10 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-nude-100">
                  <div>
                    <p className="text-xs text-nude-400 mb-1">Order Number</p>
                    <p className="font-mono text-sm font-medium text-chocolate-950">{order.orderNumber}</p>
                    <p className="text-xs text-nude-400 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-nude-400 mb-1">Total</p>
                      <p className="font-playfair text-xl text-chocolate-950">{formatPrice(order.total)}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <Link href={`/orders/${order.id}`} className="text-xs text-gold-dark hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
                <div className="flex gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="relative w-16 h-16 bg-champagne-100 flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
