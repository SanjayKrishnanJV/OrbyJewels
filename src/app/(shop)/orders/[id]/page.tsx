export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
      address: true,
    },
  });

  if (!order) notFound();

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders" className="p-2 text-nude-400 hover:text-chocolate-950 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair text-3xl text-chocolate-950">{order.orderNumber}</h1>
            <p className="text-nude-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Order Progress */}
        {!["CANCELLED", "REFUNDED"].includes(order.status) && (
          <div className="bg-white p-6 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-px bg-nude-200" />
              <div
                className="absolute top-4 left-0 h-px bg-chocolate-950 transition-all"
                style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
              />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                    i <= currentStep
                      ? "bg-chocolate-950 border-chocolate-950 text-champagne-100"
                      : "bg-white border-nude-300 text-nude-400"
                  }`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${i <= currentStep ? "text-chocolate-950" : "text-nude-400"}`}>
                    {step === "CONFIRMED" ? "Confirmed" : step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white">
              <div className="px-6 py-4 border-b border-nude-100">
                <h2 className="font-semibold text-chocolate-950">Items Ordered</h2>
              </div>
              <div className="divide-y divide-nude-50">
                {order.items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-champagne-100 flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-chocolate-950 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-nude-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-chocolate-950">{formatPrice(item.total)}</p>
                      <p className="text-xs text-nude-400">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Price summary */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-6">
              <h2 className="font-semibold text-chocolate-950 mb-4 flex items-center gap-2">
                <Package size={16} />
                Delivery Address
              </h2>
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

            <div className="bg-white p-6">
              <h2 className="font-semibold text-chocolate-950 mb-4">Payment</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-nude-500">Method</span>
                  <span className="text-chocolate-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nude-500">Status</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="block w-full py-3 text-center text-sm text-chocolate-800 border border-nude-200 hover:border-chocolate-950 hover:bg-champagne-100 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
