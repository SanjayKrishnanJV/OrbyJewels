export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { MarkAsPaidButton } from "@/components/admin/MarkAsPaidButton";

export const metadata: Metadata = { title: "Order Detail — Admin | Orby Jewels" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, slug: true, sku: true } },
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) notFound();

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 text-nude-400 hover:text-chocolate-950 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-playfair text-3xl text-chocolate-950">{order.orderNumber}</h1>
          <p className="text-nude-500 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          {order.paymentStatus !== "PAID" && (
            <MarkAsPaidButton orderId={order.id} />
          )}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-nude-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-nude-100">
              <h2 className="font-semibold text-chocolate-950">Order Items</h2>
            </div>
            <div className="divide-y divide-nude-50">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-chocolate-950">{item.product.name}</p>
                    <p className="text-xs text-nude-400 mt-0.5">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-chocolate-950">{formatPrice(item.price)} × {item.quantity}</p>
                    <p className="text-sm font-semibold text-chocolate-950 mt-0.5">{formatPrice(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-champagne-50 border-t border-nude-100 space-y-2">
              <div className="flex justify-between text-sm text-nude-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-nude-600">
                <span>Shipping</span>
                <span>{order.shipping > 0 ? formatPrice(order.shipping) : "Free"}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-chocolate-950 pt-2 border-t border-nude-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className="bg-white rounded-lg border border-nude-100 p-6">
              <h2 className="font-semibold text-chocolate-950 mb-4">Payment</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-nude-500 text-xs uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-nude-500 text-xs uppercase tracking-wider mb-1">Method</p>
                  <p className="text-chocolate-950">{order.paymentMethod}</p>
                </div>
                {order.payment.providerOrderId && (
                  <div className="col-span-2">
                    <p className="text-nude-500 text-xs uppercase tracking-wider mb-1">Provider Order ID</p>
                    <p className="font-mono text-xs text-chocolate-800">{order.payment.providerOrderId}</p>
                  </div>
                )}
                {order.payment.providerPaymentId && (
                  <div className="col-span-2">
                    <p className="text-nude-500 text-xs uppercase tracking-wider mb-1">Provider Payment ID</p>
                    <p className="font-mono text-xs text-chocolate-800">{order.payment.providerPaymentId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Customer + Address */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-4">Customer</h2>
            <p className="text-sm font-medium text-chocolate-950">{order.user.name}</p>
            <p className="text-xs text-nude-500 mt-1">{order.user.email}</p>
            <Link href={`/admin/customers`} className="text-xs text-gold-dark hover:underline mt-3 inline-block">
              View Profile →
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-4">Shipping Address</h2>
            {order.address && (
              <address className="text-sm text-chocolate-800 not-italic space-y-1">
                <p className="font-medium">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                <p>{order.address.country}</p>
              </address>
            )}
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg border border-nude-100 p-6">
              <h2 className="font-semibold text-chocolate-950 mb-3">Notes</h2>
              <p className="text-sm text-nude-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
