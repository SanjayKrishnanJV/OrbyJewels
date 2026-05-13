"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="mb-10">
          <h1 className="font-playfair text-4xl text-chocolate-950 mb-2">
            My Wishlist
            {items.length > 0 && (
              <span className="text-nude-400 text-2xl ml-3">({items.length} items)</span>
            )}
          </h1>
          <p className="text-nude-500">Pieces you love, saved for later</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-champagne-100 flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-nude-400" />
            </div>
            <h2 className="font-playfair text-2xl text-chocolate-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-nude-500 mb-8">Save your favourite pieces to buy later</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-10 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
            >
              Explore Jewellery <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
