"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  Shield,
  Truck,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  ZoomIn,
  Check,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface ProductDetailProps {
  product: Product & {
    reviews: {
      id: string;
      rating: number;
      title?: string | null;
      comment?: string | null;
      isVerified: boolean;
      createdAt: Date;
      user: { name?: string | null; image?: string | null };
    }[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [zoomStyle, setZoomStyle] = useState<any>({ display: "none" });
  const { addItem, openCart } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.comparePrice || 0);
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/checkout";
  };

  const handleWishlist = () => {
    toggle(product);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
      icon: inWishlist ? "💔" : "❤️",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    } as React.CSSProperties);
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${product.reviews.length})` },
    { id: "care", label: "Care Guide" },
  ];

  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-nude-100 py-4">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex items-center gap-2 text-xs text-nude-400">
            <Link href="/" className="hover:text-gold-dark transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-gold-dark transition-colors">Jewellery</Link>
            {product.category && (
              <>
                <ChevronRight size={12} />
                <Link href={`/category/${product.category.slug}`} className="hover:text-gold-dark transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-chocolate-950 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image with zoom */}
            <div
              className="relative aspect-square bg-champagne-100 overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ display: "none" })}
            >
              <Image
                src={product.images[selectedImage]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"}
                alt={product.images[selectedImage]?.altText || product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${product.images[selectedImage]?.url})`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                } as React.CSSProperties}
              />
              <div className="absolute top-4 right-4 bg-white/80 p-2 backdrop-blur-sm">
                <ZoomIn size={16} className="text-chocolate-800" />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gold-gradient px-3 py-1.5">
                  <span className="text-xs font-bold text-chocolate-950">-{discount}% OFF</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200 ${
                      selectedImage === i
                        ? "ring-2 ring-gold-500 opacity-100"
                        : "ring-1 ring-nude-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isNewArrival && (
                <span className="px-2.5 py-1 bg-chocolate-950 text-champagne-100 text-[10px] tracking-widest uppercase">New</span>
              )}
              {product.isBestSeller && (
                <span className="px-2.5 py-1 bg-nude-700 text-white text-[10px] tracking-widest uppercase">Best Seller</span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] tracking-widest uppercase">
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* Category */}
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs tracking-[0.3em] text-gold-dark uppercase hover:text-gold-600 transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-playfair text-3xl md:text-4xl text-chocolate-950 mt-2 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.round(avgRating) ? "#D4AF37" : "none"}
                      className={i < Math.round(avgRating) ? "text-gold-500" : "text-nude-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-nude-600">
                  {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-playfair text-3xl text-chocolate-950">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-nude-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-champagne-100 rounded-sm">
              {[
                { label: "Material", value: product.material },
                { label: "Purity", value: product.purity },
                { label: "Stone", value: product.stoneType },
                { label: "Gender", value: product.gender },
              ].filter((s) => s.value).map((spec) => (
                <div key={spec.label}>
                  <p className="text-[10px] tracking-widest uppercase text-nude-500 mb-0.5">{spec.label}</p>
                  <p className="text-sm font-medium text-chocolate-950">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-nude-500 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-nude-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-14 text-center text-sm font-medium text-chocolate-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="qty-btn"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-nude-400">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-3 w-full py-4 border-2 border-chocolate-950 text-chocolate-950 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-950 hover:text-champagne-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-3 w-full py-4 bg-gold-gradient text-chocolate-950 text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border text-sm font-medium tracking-wider uppercase transition-all ${
                    inWishlist
                      ? "border-red-200 text-red-500 bg-red-50"
                      : "border-nude-200 text-chocolate-800 hover:border-chocolate-950"
                  }`}
                >
                  <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-nude-200 text-chocolate-800 hover:border-chocolate-950 transition-all"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Trust signals */}
            <div className="space-y-3 py-5 border-t border-nude-100">
              {[
                { icon: Shield, text: "BIS Hallmarked & Certified" },
                { icon: Truck, text: "Free shipping on orders above ₹5,000" },
                { icon: RefreshCw, text: "Easy 30-day returns & exchange" },
                { icon: Check, text: "Secured payment via Razorpay" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon size={15} className="text-gold-dark flex-shrink-0" />
                  <span className="text-xs text-nude-600">{item.text}</span>
                </div>
              ))}
            </div>

            {/* SKU */}
            <p className="text-xs text-nude-400 mt-3">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="border-b border-nude-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-8 py-4 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-chocolate-950"
                      : "text-nude-500 hover:text-chocolate-800"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="product-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-10 max-w-3xl">
            {activeTab === "description" && (
              <div className="prose prose-chocolate max-w-none">
                <p className="text-nude-700 leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "SKU", value: product.sku },
                  { label: "Material", value: product.material },
                  { label: "Purity", value: product.purity },
                  { label: "Stone Type", value: product.stoneType },
                  { label: "Stone Weight", value: product.stoneWeight ? `${product.stoneWeight} ct` : null },
                  { label: "Metal Weight", value: product.metalWeight ? `${product.metalWeight} g` : null },
                  { label: "Gender", value: product.gender },
                  { label: "Occasion", value: product.occasion },
                  { label: "Origin", value: (product as { origin?: string | null }).origin },
                  { label: "Dimensions", value: product.dimensions },
                ].filter((s) => s.value).map((spec) => (
                  <div key={spec.label} className="flex items-start gap-3 py-3 border-b border-nude-100">
                    <span className="text-xs tracking-widest uppercase text-nude-400 w-36 flex-shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-sm text-chocolate-950 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {product.reviews.length === 0 ? (
                  <p className="text-nude-400">No reviews yet. Be the first to review this product.</p>
                ) : (
                  <div className="space-y-6">
                    {/* Rating summary */}
                    <div className="flex items-center gap-6 p-6 bg-champagne-100 rounded-sm">
                      <div className="text-center">
                        <p className="font-playfair text-5xl text-chocolate-950">{avgRating.toFixed(1)}</p>
                        <div className="flex justify-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.round(avgRating) ? "#D4AF37" : "none"} className={i < Math.round(avgRating) ? "text-gold-500" : "text-nude-300"} />
                          ))}
                        </div>
                        <p className="text-xs text-nude-500 mt-1">{product.reviews.length} reviews</p>
                      </div>
                    </div>

                    {product.reviews.map((review) => (
                      <div key={review.id} className="py-6 border-b border-nude-100">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-chocolate-950 text-sm">
                              {review.user?.name || "Anonymous"}
                            </p>
                            {review.isVerified && (
                              <span className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5">
                                <Check size={10} />Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "#D4AF37" : "none"} className={i < review.rating ? "text-gold-500" : "text-nude-300"} />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <p className="font-medium text-chocolate-950 mb-1">{review.title}</p>
                        )}
                        {review.comment && (
                          <p className="text-sm text-nude-600 leading-relaxed">{review.comment}</p>
                        )}
                        <p className="text-xs text-nude-400 mt-2" suppressHydrationWarning>
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-5">
                {[
                  { title: "Cleaning", content: "Clean with a soft, lint-free cloth. For deeper cleaning, use mild soap with warm water and a soft brush. Rinse thoroughly and dry completely." },
                  { title: "Storage", content: "Store separately in the provided jewellery pouch or box to prevent scratching. Keep away from direct sunlight and humidity." },
                  { title: "Wearing", content: "Remove jewellery before swimming, bathing, or exercising. Avoid contact with perfumes, hairspray, and harsh chemicals." },
                  { title: "Maintenance", content: "We recommend professional cleaning and inspection every 6-12 months to maintain the beauty and integrity of your piece." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-2" />
                    <div>
                      <p className="font-medium text-chocolate-950 mb-1">{item.title}</p>
                      <p className="text-sm text-nude-600 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
