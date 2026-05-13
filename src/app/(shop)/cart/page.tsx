"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const subtotal = totalPrice();
  const shipping = subtotal > 5000 ? 0 : 99;
  const taxRate = 0.03;
  const tax = Math.round((subtotal - discount) * taxRate);
  const total = subtotal - discount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderValue: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discount);
        setAppliedCoupon(couponCode.toUpperCase());
        toast.success(`Coupon applied! You saved ${formatPrice(data.discount)}`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 rounded-full bg-champagne-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-nude-400" />
          </div>
          <h1 className="font-playfair text-3xl text-chocolate-950 mb-3">Your cart is empty</h1>
          <p className="text-nude-500 mb-8">Discover our beautiful jewellery collection</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h1 className="font-playfair text-4xl text-chocolate-950 mb-8">
          Shopping Cart <span className="text-nude-400 text-2xl">({totalItems()} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-5 flex gap-5"
              >
                <Link href={`/products/${item.product.slug}`} className="relative w-28 h-32 flex-shrink-0 bg-champagne-100 overflow-hidden">
                  <Image
                    src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300"}
                    alt={item.product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-playfair text-lg text-chocolate-950 hover:text-gold-dark transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.product.material && (
                        <p className="text-xs text-nude-500 mt-1">{item.product.material}</p>
                      )}
                      {item.product.category && (
                        <p className="text-xs text-nude-400">{item.product.category.name}</p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-nude-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-nude-200">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="qty-btn">
                        <Minus size={13} />
                      </button>
                      <span className="w-12 text-center text-sm font-medium text-chocolate-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="qty-btn"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-xl text-chocolate-950">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-nude-400">{formatPrice(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white p-6 sticky top-24">
              <h2 className="font-playfair text-xl text-chocolate-950 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-xs tracking-widest uppercase text-nude-500 mb-2 block">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{appliedCoupon} applied</span>
                    <button
                      onClick={() => { setDiscount(0); setAppliedCoupon(""); setCouponCode(""); }}
                      className="ml-auto text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ORBY10"
                      className="flex-1 px-3 py-2.5 border border-nude-200 text-sm focus:outline-none focus:border-gold-500 text-chocolate-950"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="px-4 py-2.5 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-xs text-nude-400 mt-1">Try: ORBY10, WELCOME500, LUXURY20</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 border-t border-nude-100 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Subtotal ({totalItems()} items)</span>
                  <span className="text-chocolate-950">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-chocolate-950"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">GST (3%)</span>
                  <span className="text-chocolate-950">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-playfair text-xl border-t border-nude-100 pt-3 mt-3">
                  <span className="text-chocolate-950">Total</span>
                  <span className="text-chocolate-950">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-nude-400 mt-3 text-center">
                  Add {formatPrice(5000 - subtotal)} more for FREE shipping
                </p>
              )}

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 mt-6 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link href="/products" className="flex items-center justify-center w-full py-3 mt-3 text-sm text-nude-500 hover:text-chocolate-950 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
