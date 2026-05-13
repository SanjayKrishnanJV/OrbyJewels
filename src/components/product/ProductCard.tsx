"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const { addItem, openCart } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];
  const secondaryImage = product.images?.[1];
  const discount = calculateDiscount(product.price, product.comparePrice || 0);
  const inWishlist = isInWishlist(product.id);

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;
  const reviewCount = product._count?.reviews || product.reviews?.length || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
      icon: inWishlist ? "💔" : "❤️",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        className="group relative bg-white overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setImageIdx(0); }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-champagne-100 overflow-hidden">
          {/* Full-area navigation link behind interactive elements */}
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 z-0"
            aria-label={product.name}
          />
          <Image
            src={primaryImage?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"}
            alt={primaryImage?.altText || product.name}
            fill
            className={`object-cover transition-all duration-700 ${isHovered && secondaryImage ? "opacity-0" : "opacity-100"}`}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.name}
              fill
              className={`object-cover transition-all duration-700 absolute inset-0 ${isHovered ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="px-2.5 py-1 bg-chocolate-950 text-champagne-100 text-[10px] tracking-widest uppercase font-medium">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-gold-gradient text-chocolate-950 text-[10px] tracking-widest uppercase font-semibold">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <span className="px-2.5 py-1 bg-nude-700 text-white text-[10px] tracking-widest uppercase font-medium">
                Best Seller
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
              inWishlist
                ? "bg-red-50 text-red-500"
                : "bg-white/80 text-chocolate-800 opacity-0 group-hover:opacity-100"
            } hover:scale-110`}
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </button>

          {/* Quick actions overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 left-0 right-0 z-10 p-3 flex gap-2"
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-chocolate-950/90 backdrop-blur-sm text-champagne-100 text-xs font-medium tracking-widest uppercase hover:bg-chocolate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={13} />
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="relative z-10 w-12 flex items-center justify-center bg-white/90 backdrop-blur-sm text-chocolate-950 hover:bg-white transition-colors"
            >
              <Eye size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-[10px] tracking-[0.25em] text-nude-500 uppercase mb-1.5">
              {product.category.name}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-playfair text-sm text-chocolate-950 hover:text-gold-dark transition-colors duration-200 line-clamp-2 leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.floor(avgRating) ? "#D4AF37" : "none"}
                    className={i < Math.floor(avgRating) ? "text-gold-500" : "text-nude-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-nude-500">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-playfair text-base text-chocolate-950 font-medium">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-nude-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.material && (
            <p className="text-[10px] text-nude-400 mt-1">{product.material}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
