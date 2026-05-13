"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-chocolate-950/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[100] w-full max-w-md bg-ivory-DEFAULT flex flex-col shadow-luxury"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-nude-200">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-chocolate-950" />
                <h2 className="font-playfair text-xl text-chocolate-950">
                  Your Cart
                </h2>
                <span className="w-5 h-5 bg-chocolate-950 text-champagne-100 text-xs rounded-full flex items-center justify-center">
                  {totalItems()}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-nude-100 rounded-full transition-colors"
              >
                <X size={20} className="text-chocolate-800" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                  <div className="w-20 h-20 rounded-full bg-champagne-100 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-nude-400" />
                  </div>
                  <p className="font-playfair text-xl text-chocolate-800">Your cart is empty</p>
                  <p className="text-nude-500 text-sm text-center">
                    Discover our exquisite jewellery collection and add something beautiful.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-8 py-3 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-nude-100">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 p-5"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-28 flex-shrink-0 bg-champagne-100 overflow-hidden">
                        <Image
                          src={
                            item.product.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-playfair text-sm text-chocolate-950 hover:text-gold-dark transition-colors line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        {item.product.material && (
                          <p className="text-xs text-nude-500 mt-1">{item.product.material}</p>
                        )}
                        <p className="text-sm font-semibold text-chocolate-950 mt-2">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-nude-200">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="qty-btn"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-10 text-center text-sm font-medium text-chocolate-950">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="qty-btn"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 text-nude-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-nude-200 p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nude-600">Subtotal</span>
                  <span className="font-playfair text-xl text-chocolate-950">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <p className="text-xs text-nude-400">Shipping and taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full py-3 border border-nude-200 text-chocolate-800 text-sm hover:border-chocolate-950 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
